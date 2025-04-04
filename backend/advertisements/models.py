from django.db import models
from django.conf import settings
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
    FileExtensionValidator,
)
from django.utils.translation import gettext_lazy as _
from django.core.cache import cache
from django.core.files.storage import default_storage
from .constants import (
    CATEGORY_CHOICES,
    PRODUCT_TYPE_CHOICES,
    CONDITION_CHOICES,
    OWNERSHIP_HISTORY_CHOICES,
    STATUS_CHOICES,
)
from django.db.models import F
import uuid
from django.utils import timezone
from decimal import Decimal


class ProductImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='product_images')
    image = models.ImageField(
        upload_to='product_images/',
        help_text=_("Product image file"),
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])],
        max_length=255
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = _("Product Image")
        verbose_name_plural = _("Product Images")

    def __str__(self):
        return f"Image for {self.product.title}"

    def delete(self, *args, **kwargs):
        """Override delete to clean up the image file"""
        if self.image:
            self.image.delete(save=False)
        super().delete(*args, **kwargs)


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
    title = models.CharField(
        max_length=200, help_text=_("The title of the product listing")
    )
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default="Photography & Videography",
        help_text=_("The main category this product belongs to"),
    )
    product_type = models.CharField(
        max_length=50,
        choices=PRODUCT_TYPE_CHOICES,
        default="camera",
        help_text=_("The specific type of product within the category"),
    )
    description = models.TextField(help_text=_("Detailed description of the product"))
    location = models.CharField(
        max_length=255,
        help_text=_("Location where the product is available for pickup/delivery"),
    )
    unavailable_dates = models.JSONField(
        default=list, help_text=_("Dates when the product is not available for rental")
    )
    security_deposit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(Decimal("0"))],
        help_text=_("Security deposit required for renting"),
    )
    # Condition field is set to 'pending' initially and updated by admins after review
    condition = models.CharField(
        max_length=20,
        choices=CONDITION_CHOICES,
        default="pending",
        help_text=_(
            "The current condition of the product, updated by admins after review"
        ),
    )
    purchase_year = models.CharField(
        max_length=4,
        null=True,
        blank=True,
        help_text=_("Year when the item was purchased"),
    )
    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(Decimal("0"))],
        help_text=_("Original purchase price"),
    )
    ownership_history = models.CharField(
        max_length=20,
        choices=OWNERSHIP_HISTORY_CHOICES,
        default="firsthand",
        help_text=_("Whether the item was purchased new or used"),
    )
    pricing_tiers = models.JSONField(
        default=list,
        help_text=_(
            "List of pricing tiers, each containing duration_unit (day/week/month), max_period (maximum rental duration), and price (price per unit)"
        ),
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft",
        db_index=True,
        help_text=_("Current status of the product listing"),
    )
    # Status message to inform owner about status changes
    status_message = models.TextField(
        null=True,
        blank=True,
        null=True,
        help_text=_("Message explaining status change to the owner"),
    )
    # Track when the status was last changed
    status_changed_at = models.DateTimeField(
        auto_now=True,
        null=True,
        blank=True,
        help_text=_("When status was last changed"),
    )
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        help_text=_("Average rating from all reviews"),
    )
    # views_count tracks how many times the product page has been viewed
    # This is useful for analytics and sorting popular items
    views_count = models.PositiveIntegerField(
        default=0, help_text=_("Number of times this product has been viewed")
    )
    # rental_count tracks how many times the product has been rented
    # This is useful for analytics and sorting popular items
    rental_count = models.PositiveIntegerField(
        default=0, help_text=_("Number of times this product has been rented")
    )
    created_at = models.DateTimeField(
        auto_now_add=True, help_text=_("When the product was first listed")
    )
    updated_at = models.DateTimeField(
        auto_now=True, help_text=_("When the product was last updated")
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Product")
        verbose_name_plural = _("Products")
        indexes = [
            models.Index(fields=["category"]),
            models.Index(fields=["product_type"]),
            models.Index(fields=["location"]),
            models.Index(fields=["status"]),
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

    def check_availability(self, start_time, end_time):
        """
        Check if the product is available for the specified time period.

        Args:
            start_time: The start time of the requested rental period
            end_time: The end time of the requested rental period

        Returns:
            bool: True if the product is available, False otherwise
        """
        # Check if the product is active and not marked as unavailable
        if self.status != "active":
            return False

        # TODO: Implement rental availability check when rental model is added
        return True

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
