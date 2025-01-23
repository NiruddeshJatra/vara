# advertisements/models.py
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, FileExtensionValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .utils import compress_image
from .constants import CATEGORY_CHOICES, CATEGORY_GROUPS
from django.db.models import Avg, F

class Product(models.Model):
    title = models.CharField(
        max_length=100, 
        verbose_name=_("Title"), 
        help_text=_("Enter the property title")
    )
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES, 
        verbose_name=_("Category"), 
        help_text=_("Select the category that best describes your item"),
        db_index=True  # Add index for better query performance
    )
    description = models.TextField(
        verbose_name=_("Description"), 
        help_text=_("Detailed description of the property")
    )
    image = models.ImageField(
        upload_to="product_images/",
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])],
        help_text=_("Upload a product image (max 5MB)")
    )
    security_deposit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text=_("Security deposit required for renting")
    )
    location = models.CharField(
        max_length=255, 
        null=True, 
        blank=True,
        db_index=True  # Add index for location-based searches
    )
    is_available = models.BooleanField(
        default=True,
        db_index=True  # Add index for availability filtering
    )
    views_count = models.PositiveIntegerField(  # New field for analytics
        default=0,
        editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="advertisements"
    )
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        editable=False,
        db_index=True
    )
    status = models.CharField(  # New field for product status
        max_length=20,
        choices=[
            ('draft', _('Draft')),
            ('active', _('Active')),
            ('maintenance', _('Under Maintenance')),
            ('suspended', _('Suspended')),
        ],
        default='active',
        db_index=True
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = _("Property")
        verbose_name_plural = _("Properties")
        indexes = [
            models.Index(fields=['category', 'is_available', 'status']),
            models.Index(fields=['location', 'user']),
            models.Index(fields=['created_at', 'status']),
        ]

    def clean(self):
        # Add validation logic
        if self.security_deposit < 0:
            raise ValidationError(_("Security deposit cannot be negative"))

    def save(self, *args, **kwargs):
        self.clean()
        cache_keys = [
            f'product_detail_{self.pk}',
            f'product_list_{self.category}_{self.location}'
        ]
        cache.delete_many(cache_keys)
        if (self.pk is None or self._state.adding or 
            Product.objects.get(pk=self.pk).image != self.image) and self.image:
            if compressed_image := compress_image(self.image):
                self.image = compressed_image
        super().save(*args, **kwargs)

    def increment_views(self):
        """Increment the view count for this product"""
        self.views_count += 1
        self.save(update_fields=['views_count'])

    @property
    def is_rentable(self):
        """Check if the product can be rented"""
        return (
            self.is_available and 
            self.status == 'active' and 
            hasattr(self, 'pricing')
        )

    def update_average_rating(self):
        from reviews.models import Review  # Import here to avoid circular import
        avg = Review.objects.filter(
            review_type='property',
            rental__product=self
        ).aggregate(Avg('rating'))['rating__avg'] or 0
        self.average_rating = round(avg, 2)
        self.save(update_fields=['average_rating'])

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"


class PricingOption(models.Model):
    DURATION_CHOICES = [
        ('hour', _('Per Hour')),
        ('day', _('Per Day')),
        ('week', _('Per Week')),
        ('month', _('Per Month')),
    ]

    product = models.OneToOneField(
        'Product', 
        on_delete=models.CASCADE,
        related_name='pricing'
    )
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text=_("Base rental price")
    )
    duration_unit = models.CharField(
        max_length=5,
        choices=DURATION_CHOICES,
        default='day',
        help_text=_("Price per duration unit")
    )
    minimum_rental_period = models.PositiveIntegerField(
        default=1,
        help_text=_("Minimum rental period in selected duration units")
    )
    maximum_rental_period = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text=_("Maximum rental period in selected duration units (leave blank for no limit)")
    )
    discount_percentage = models.DecimalField(  # New field for discounts
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=0,
        help_text=_("Discount percentage (0-100)")
    )
    
    class Meta:
        verbose_name = _("Pricing Option")
        verbose_name_plural = _("Pricing Options")

    def clean(self):
        if self.maximum_rental_period and self.maximum_rental_period < self.minimum_rental_period:
            raise ValidationError(_("Maximum rental period must be greater than minimum rental period"))

    def calculate_price(self, duration):
        """Calculate the total price for a given duration"""
        base_total = self.base_price * duration
        discount = (base_total * self.discount_percentage) / 100
        return base_total - discount

    def __str__(self):
        return f"{self.product.title} - {self.get_duration_unit_display()}"


class AvailabilityPeriod(models.Model):
    product = models.ForeignKey(
        'Product',
        on_delete=models.CASCADE,
        related_name='availability_periods'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    is_available = models.BooleanField(default=True)
    notes = models.TextField(  # New field for availability notes
        blank=True,
        help_text=_("Optional notes about this availability period")
    )
    
    class Meta:
        ordering = ['start_date']
        verbose_name = _("Availability Period")
        verbose_name_plural = _("Availability Periods")
        indexes = [
            models.Index(fields=['start_date', 'end_date']),
        ]
        
    def clean(self):
        if self.end_date < self.start_date:
            raise ValidationError(_("End date must be greater than or equal to start date."))
        # Check for overlapping periods
        overlapping = AvailabilityPeriod.objects.filter(
            product=self.product,
            start_date__lte=self.end_date,
            end_date__gte=self.start_date
        ).exclude(pk=self.pk)
        if overlapping.exists():
            raise ValidationError(_("Availability periods cannot overlap"))

    def __str__(self):
        return f"{self.product.title}: {self.start_date} to {self.end_date}"