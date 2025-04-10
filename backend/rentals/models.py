from django.db import models
from django.utils import timezone
from django.conf import settings
from decimal import Decimal
from advertisements.models import Product
from datetime import timedelta
import calendar

# Rental status choices
STATUS_CHOICES = [
    ("pending", "Pending"),
    ("approved", "Approved"),
    ("rejected", "Rejected"),
    ("cancelled", "Cancelled"),
    ("completed", "Completed"),
    ("in_progress", "In Progress"),
]

# Duration unit choices
DURATION_UNIT_CHOICES = [
    ("day", "Day"),
    ("week", "Week"),
    ("month", "Month"),
]

class Rental(models.Model):
    renter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="rentals_as_renter"
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="rentals_as_owner"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="rentals"
    )

    # Rental period
    start_time = models.DateTimeField(help_text="When rental period starts")
    end_time = models.DateTimeField(help_text="When rental period ends")
    duration = models.PositiveIntegerField(
        help_text="Number of duration units")
    duration_unit = models.CharField(
        max_length=10,
        choices=DURATION_UNIT_CHOICES,
        help_text="Unit of duration (day, week, month)"
    )

    # Cost information
    total_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Total rental cost including fees"
    )
    service_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Service fee amount"
    )
    security_deposit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Security deposit amount"
    )

    # Rental details
    purpose = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Purpose of the rental"
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes about the rental"
    )
    # Status tracking
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default="pending",
        help_text="Current status of the rental"
    )
    status_history = models.JSONField(
        default=list,
        help_text="History of status changes"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Rental"
        verbose_name_plural = "Rentals"

    def __str__(self):
        return f"{self.product.title} - {self.renter.username} ({self.status})"

    def update_status(self, new_status: str, note: str = None):
        """
        Update rental status and add to history
        """
        if new_status not in dict(STATUS_CHOICES):
            raise ValueError(f"Invalid status: {new_status}")

        self.status = new_status
        self.status_history.append({
            "status": new_status,
            "timestamp": timezone.now().isoformat(),
            "note": note
        })
        self.save()

    def calculate_total_cost(self) -> Decimal:
        """
        Calculate total cost based on product's pricing tier
        """
        if not self.product.pricing_tiers.exists():
            return Decimal("0.00")

        tier = self.product.pricing_tiers.filter(
            duration_unit=self.duration_unit
        ).first()

        if not tier:
            return Decimal("0.00")

        base_cost = tier.price * self.duration
        total_cost = base_cost + self.service_fee
        return total_cost

    def calculate_end_time(self) -> datetime:
        """
        Calculate the end time based on start time, duration, and duration unit
        """
        if not self.start_time or not self.duration or not self.duration_unit:
            return None

        end_time = self.start_time
        
        if self.duration_unit == "day":
            end_time += timedelta(days=self.duration)
        elif self.duration_unit == "week":
            end_time += timedelta(weeks=self.duration)
        elif self.duration_unit == "month":
            # Add months by incrementing the month and adjusting the day
            year = end_time.year + (end_time.month + self.duration - 1) // 12
            month = (end_time.month + self.duration - 1) % 12 + 1
            day = min(end_time.day, calendar.monthrange(year, month)[1])
            end_time = end_time.replace(year=year, month=month, day=day)
        
        return end_time

    def save(self, *args, **kwargs):
        """
        Calculate total cost and end time before saving
        """
        if not self.total_cost:
            self.total_cost = self.calculate_total_cost()
        
        # Ensure security deposit is set
        if not self.security_deposit and self.product.security_deposit:
            self.security_deposit = self.product.security_deposit

        # Calculate end time if not set
        if not self.end_time:
            self.end_time = self.calculate_end_time()

        super().save(*args, **kwargs)


class RentalPhoto(models.Model):
    rental = models.ForeignKey(
        Rental, on_delete=models.CASCADE, related_name="rental_photos"
    )
    photo = models.ImageField(
        upload_to="rental_photos/",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
        help_text=_("Upload a photo (max 5MB)"),
    )
    photo_type = models.CharField(
        max_length=20,
        choices=[("pre_rental", "Pre-Rental"), ("post_rental", "Post-Rental")],
        help_text=_("Type of photo (pre-rental or post-rental)"),
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.photo_type} photo for Rental #{self.rental.id}"

    class Meta:
        verbose_name = _("Rental Photo")
        verbose_name_plural = _("Rental Photos")
