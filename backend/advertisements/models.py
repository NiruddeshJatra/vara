from django.db import models
from django.conf import settings
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
    FileExtensionValidator,
)
from django.utils.translation import gettext_lazy as _
from .constants import (
    CATEGORY_CHOICES,
    PRODUCT_TYPE_CHOICES,
    OWNERSHIP_HISTORY_CHOICES,
    STATUS_CHOICES,
    DURATION_UNITS,
)
from django.db.models import F
import uuid
from decimal import Decimal
from django.core.exceptions import ValidationError
from datetime import datetime


class ProductImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        "Product", on_delete=models.CASCADE, related_name="product_images"
    )
    image = models.ImageField(
        upload_to="product_images/",
        help_text=_("Product image file"),
        validators=[FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"])],
        max_length=255,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = _("Product Image")
        verbose_name_plural = _("Product Images")

    def __str__(self):
        return f"Image for {self.product.title}"

    def delete(self, *args, **kwargs):
        """Override delete to clean up the image file"""
        if self.image:
            self.image.delete(save=False)
        super().delete(*args, **kwargs)


class UnavailableDate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        "Product", on_delete=models.CASCADE, related_name="unavailable_dates"
    )
    date = models.DateField(help_text=_("Single unavailable date"))
    is_range = models.BooleanField(
        default=False, help_text=_("Is this part of a date range?")
    )
    range_start = models.DateField(
        null=True, blank=True, help_text=_("Start date of range")
    )
    range_end = models.DateField(
        null=True, blank=True, help_text=_("End date of range")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date"]
        verbose_name = _("Unavailable Date")
        verbose_name_plural = _("Unavailable Dates")
        constraints = [
            models.CheckConstraint(
                check=models.Q(
                    models.Q(is_range=False)
                    | (
                        models.Q(is_range=True)
                        & models.Q(range_start__isnull=False)
                        & models.Q(range_end__isnull=False)
                        & models.Q(range_end__gte=models.F("range_start"))
                    )
                ),
                name="valid_date_range",
            )
        ]

    def __str__(self):
        if self.is_range:
            return f"Unavailable from {self.range_start} to {self.range_end}"
        return f"Unavailable on {self.date}"

    def clean(self):
        if self.is_range and (not self.range_start or not self.range_end):
            raise ValidationError(
                "Range start and end dates are required for date ranges"
            )
        if not self.is_range and not self.date:
            raise ValidationError("Date is required for single dates")


class PricingTier(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        "Product", on_delete=models.CASCADE, related_name="pricing_tiers"
    )
    duration_unit = models.CharField(
        max_length=10,
        choices=DURATION_UNITS,
        help_text=_("Duration unit (day/week/month)"),
    )
    price = models.PositiveIntegerField(
        help_text=_("Price per duration unit in Taka"),
    )
    max_period = models.PositiveIntegerField(
        default=30,  # Default to 30 days/weeks/months
        help_text=_(
            "Maximum rental period in the specified duration unit (optional, defaults to 30)"
        ),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["duration_unit", "price"]
        verbose_name = _("Pricing Tier")
        verbose_name_plural = _("Pricing Tiers")
        constraints = [
            models.UniqueConstraint(
                fields=["product", "duration_unit"],
                name="unique_duration_unit_per_product",
            )
        ]

    def __str__(self):
        return f"{self.duration_unit} - ${self.price} (max {self.max_period})"


class Product(models.Model):
    """
    Product model represents a rental item in the marketplace.
    It contains all the necessary information about the item, its pricing, and availability.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="products",
        help_text=_("The user who owns this product"),
    )
    title = models.CharField(max_length=255, help_text=_("Product title"))
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        help_text=_("Product category"),
    )
    product_type = models.CharField(
        max_length=50,
        choices=PRODUCT_TYPE_CHOICES,
        help_text=_("Product type"),
    )
    description = models.TextField(help_text=_("Product description"))
    location = models.CharField(
        max_length=255,
        help_text=_("Product location"),
    )
    security_deposit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_("Security deposit amount (optional)"),
    )
    purchase_year = models.CharField(
        max_length=4,
        default=str(datetime.now().year),
        help_text=_("Year of purchase (defaults to current year)")
    )
    original_price = models.DecimalField(
        max_digits=10, decimal_places=2, help_text=_("Original purchase price")
    )
    ownership_history = models.CharField(
        max_length=20,
        choices=OWNERSHIP_HISTORY_CHOICES,
        help_text=_("Ownership history"),
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft",
        help_text=_("Product status (managed by admins)"),
    )
    status_message = models.TextField(
        null=True,
        blank=True,
        help_text=_(
            "Admin message for status changes (e.g., maintenance or suspension reason)"
        ),
    )
    status_changed_at = models.DateTimeField(
        null=True, blank=True, help_text=_("When status was last changed by admin")
    )
    # Internal tracking fields
    views_count = models.PositiveIntegerField(
        default=0, help_text=_("Internal: Number of views")
    )
    rental_count = models.PositiveIntegerField(
        default=0, help_text=_("Internal: Number of rentals")
    )
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        help_text=_("Average rating from all reviews"),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Product")
        verbose_name_plural = _("Products")
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["category"]),
            models.Index(fields=["location"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["average_rating"]),
        ]

    def __str__(self):
        return self.title

    def increment_views(self):
        """
        Increment the view count for this product.
        Uses F() expression to avoid race conditions when multiple users view simultaneously.
        """
        self.views_count = F("views_count") + 1
        self.save(update_fields=["views_count"])

    def increment_rentals(self):
        """
        Increment the rental count for this product.
        Uses F() expression to avoid race conditions when multiple rentals complete simultaneously.
        """
        self.rental_count = F("rental_count") + 1
        self.save(update_fields=["rental_count"])

    def update_average_rating(self, new_rating):
        """
        Update the average rating for this product when a new review is added.

        Args:
            new_rating: The rating value from the new review
        """
        # Calculate new average rating
        total_ratings = self.rental_count
        current_total = self.average_rating * total_ratings
        new_total = current_total + new_rating
        self.average_rating = new_total / (total_ratings + 1)
        self.save(update_fields=["average_rating"])

    def is_date_available(self, check_date):
        """
        Check if the product is available on a specific date.

        Args:
            check_date: The date to check availability for

        Returns:
            bool: True if the product is available on the given date, False otherwise
        """
        return not self.unavailable_dates.filter(
            models.Q(
                models.Q(is_range=False, date=check_date)
                | models.Q(
                    is_range=True,
                    range_start__lte=check_date,
                    range_end__gte=check_date,
                )
            )
        ).exists()

    def update_status(self, new_status, message=None):
        """
        Update the status of the product and set a message for the owner.

        Args:
            new_status: The new status to set
            message: Optional message explaining the status change
        """
        from django.utils import timezone

        self.status = new_status
        if message:
            self.status_message = message
        self.status_changed_at = timezone.now()
        self.save(update_fields=["status", "status_message", "status_changed_at"])

        # Here you would trigger a notification to the owner
        # This would typically be handled by a signal or a notification service
        # For example:
        # notify_owner_status_change(self.owner, self, new_status, message)
