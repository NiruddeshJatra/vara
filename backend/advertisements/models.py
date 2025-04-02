from django.db import models
from django.conf import settings
from django.core.validators import (
    MinValueValidator,
    FileExtensionValidator,
    MaxValueValidator,
)
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.cache import cache
from .utils import compress_image
from .constants import CATEGORY_CHOICES, CATEGORY_GROUPS
from django.db.models import Avg, F
from django.contrib.auth.models import User


class Product(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="products", null=True, blank=True)
    title = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=200, null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_available = models.BooleanField(default=True, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Draft'),
            ('active', 'Active'),
            ('maintenance', 'Under Maintenance'),
            ('suspended', 'Suspended')
        ],
        default='active',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    unavailable_dates = models.JSONField(default=list, blank=True)
    views_count = models.PositiveIntegerField(default=0, editable=False)
    rental_count = models.PositiveIntegerField(default=0, editable=False)
    pricing = models.ForeignKey(
        "PricingOption",
        on_delete=models.CASCADE,
        related_name="product_pricing",
        null=True,
    )
    security_deposit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text=_("Security deposit required for renting"),
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['location']),
            models.Index(fields=['is_available']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # used to clear cached data related to product listings whenever a Product instance is saved. This ensures that the cache is updated to reflect the latest product data, preventing outdated information from being served to users.
        cache.delete_many(keys=cache.keys("product_list_*"))
        if (
            self.pk is None # means that this Product instance is being created for the first time
            or self._state.adding # checks if the Product instance is in the process of being added to the database.
            or Product.objects.get(pk=self.pk).image != self.image
        ) and self.image:
            # Compress the image before saving
            if compressed_image := compress_image(self.image):
                self.image = compressed_image
        super().save(*args, **kwargs)
        if not hasattr(self, 'pricing'): # ensure that a PricingOption is created whenever a Product is created.
            PricingOption.objects.create(product=self, base_price=0)

    def increment_views(self):
        self.views_count = F('views_count') + 1 # F() expressions are used to reference a model field's value in the database. This ensures that the views_count field is updated directly in the database in a single query.
        self.save(update_fields=["views_count"])

    def increment_rentals(self):
        self.rental_count = F('rental_count') + 1
        self.save(update_fields=["rental_count"])

    def check_availability(self, start_time, end_time):
        if not self.is_available:
            return False
        
        overlapping_rentals = self.rentals.filter(
            status__in=["accepted", "in_progress"],
            start_time__lt=end_time,
            end_time__gt=start_time,
        )
        return not overlapping_rentals.exists()

    def update_average_rating(self, new_rating):
        # Calculate new average rating
        total_ratings = self.rental_count
        current_total = self.average_rating * total_ratings
        new_total = current_total + new_rating
        self.average_rating = new_total / (total_ratings + 1)
        self.save(update_fields=["average_rating"])


# created to allow multiple images for a product
class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name="images"
    )
    image = models.ImageField(
        upload_to="product_images/",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
        help_text=_("Upload a product image (max 5MB)"),
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.product.title}"

    class Meta:
        verbose_name = _("Product Image")
        verbose_name_plural = _("Product Images")


class PricingOption(models.Model):
    DURATION_CHOICES = [
        ("hour", _("Per Hour")),
        ("day", _("Per Day")),
        ("week", _("Per Week")),
        ("month", _("Per Month")),
    ]
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text=_("Base rental price"),
    )
    duration_unit = models.CharField(
        max_length=5,
        choices=DURATION_CHOICES,
        default="day",
        help_text=_("Price per duration unit"),
    )
    minimum_rental_period = models.PositiveIntegerField(
        default=1, help_text=_("Minimum rental period in selected duration units")
    )
    maximum_rental_period = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text=_(
            "Maximum rental period in selected duration units (leave blank for no limit)"
        ),
    )

    class Meta:
        verbose_name = _("Pricing Option")
        verbose_name_plural = _("Pricing Options")

    def clean(self):
        super().clean()
        if not self.base_price:
            raise ValidationError("Base price must be set.")
        if (
            self.maximum_rental_period
            and self.maximum_rental_period < self.minimum_rental_period
        ):
            raise ValidationError(
                _("Maximum rental period must be greater than minimum rental period")
            )

    def __str__(self):
        return f"{self.product.title} - {self.base_price} Taka for each {self.duration_unit}"
