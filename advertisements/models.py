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


class Product(models.Model):
    title = models.CharField(
        max_length=100,
        verbose_name=_("Title"),
        help_text=_("Enter the property title"),
        db_index=True,
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        verbose_name=_("Category"),
        help_text=_("Select the category that best describes your item"),
        db_index=True,
    )
    description = models.TextField(
        verbose_name=_("Description"),
        help_text=_("Detailed description of the property"),
    )
    image = models.ImageField(
        upload_to="product_images/",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
        help_text=_("Upload a product image (max 5MB)"),
    )
    location = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    is_available = models.BooleanField(default=True)
    views_count = models.PositiveIntegerField(default=0, editable=False)
    rental_count = models.PositiveIntegerField(default=0, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="advertisements",
    )
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        editable=False,
    )
    pricing = models.OneToOneField(
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
        ordering = ["-created_at"]
        verbose_name = _("Property")
        verbose_name_plural = _("Properties")
        indexes = [
            # BLACKBOX - don't know how this works but it's important for performance.
            # Indexes are used to optimize database queries.
            # By default, Django creates an index for the primary key of the model.
            models.Index(fields=["category", "is_available", "status"]),
            models.Index(fields=["location", "owner"]),
            models.Index(fields=["created_at", "status"]),
        ]

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
        self.views_count = F('views_count') + 1 # F() expressions are used to reference a model field’s value in the database. This ensures that the views_count field is updated directly in the database in a single query.
        self.save(update_fields=["views_count"])

    def increment_rentals(self):
        self.rental_count = F('rental_count') + 1
        self.save(update_fields=["rental_count"])

    def check_availability(self, start_time, end_time):
        if not self.is_available:
            return False
        periods = self.availability_periods.filter(is_available=True)
        if periods.exists():
            return any(
                period.start_date <= start_time.date()
                and period.end_date >= end_time.date()
                for period in periods
            )
        return True

    def update_average_rating(self):
        from reviews.models import Review

        avg = (
            Review.objects.filter(
                review_type="property", rental__product=self
            ).aggregate(Avg("rating"))["rating__avg"]
            or 0
        )
        self.average_rating = round(avg, 2)
        self.save(update_fields=["average_rating"])

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"


class PricingOption(models.Model):
    DURATION_CHOICES = [
        ("hour", _("Per Hour")),
        ("day", _("Per Day")),
        ("week", _("Per Week")),
        ("month", _("Per Month")),
    ]
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="pricing_options",
    )
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
        return f"{self.product.title} - {self.get_duration_unit_display()}"


class AvailabilityPeriod(models.Model):
    product = models.ForeignKey(
        "Product", on_delete=models.CASCADE, related_name="availability_periods"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    is_available = models.BooleanField(default=True)
    notes = models.TextField(
        blank=True, help_text=_("Optional notes about this availability period")
    )

    class Meta:
        ordering = ["start_date"]
        verbose_name = _("Availability Period")
        verbose_name_plural = _("Availability Periods")
        indexes = [
            models.Index(fields=["start_date", "end_date"]),
        ]

    def clean(self):
        if self.end_date < self.start_date:
            raise ValidationError(
                _("End date must be greater than or equal to start date.")
            )
        overlapping = AvailabilityPeriod.objects.filter(
            product=self.product,
            start_date__lte=self.end_date,
            end_date__gte=self.start_date,
        ).exclude(pk=self.pk)
        if overlapping.exists():
            raise ValidationError(_("Availability periods cannot overlap"))

    def __str__(self):
        return f"{self.product.title}: {self.start_date} to {self.end_date}"
