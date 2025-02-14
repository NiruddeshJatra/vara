from django.db import models, transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import uuid
from django.utils.translation import gettext_lazy as _
from users.models import CustomUser
from advertisements.models import Product
# from payments.models import Dispute
# from payments.models import Payment


class Rental(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
        ("in_progress", "In Progress"),
    ]

    renter = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="rentals_as_renter"
    )
    owner = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="rentals_as_owner"
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="rentals" # a single product can be rented multiple times by different users. Each rental instance represents a separate rental period for the same product.
    )
    start_time = models.DateTimeField(help_text=_("When renting period starts"))
    end_time = models.DateTimeField(help_text=_("When renting period ends"))
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="pending")
    security_deposit = models.DecimalField(
        max_digits=5, decimal_places=2, editable=False, default=Decimal('0.00')
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # TODO: Connection to the escrow payment, may add later.
    # escrow_payment = models.OneToOneField(
    #     "EscrowPayment", on_delete=models.CASCADE, related_name="rental_escrow", null=True, blank=True
    # )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["owner", "renter"]),
            models.Index(fields=['product', 'status']),
        ]

    def clean(self):
        super().clean()
        if not self.product.check_availability(self.start_time, self.end_time):
            raise ValidationError(
                "The product is not available for the selected time period."
            )

    # TODO: need to revisit this after building frontend
    @property
    def total_price(self):
        duration = self.end_time - self.start_time
        duration_days = duration.days
        duration_hours = duration.total_seconds() / 3600

        pricing = self.product.pricing
        base_price = pricing.base_price
        duration_unit = pricing.duration_unit

        if duration_unit == "hour":
            total_price = duration_hours * base_price
        elif duration_unit == "day":
            total_price = duration_days * base_price
        elif duration_unit == "week":
            total_price = (duration_days / 7) * base_price
        elif duration_unit == "month":
            total_price = (duration_days / 30) * base_price
        else:
            total_price = 0

        return round(total_price, 2)

    def save(self, *args, **kwargs):
        self.clean()
        self.owner = self.product.owner
        self.security_deposit = self.product.security_deposit
        super().save(*args, **kwargs)

    @property
    def is_active(self):
        now = timezone.now()
        return self.status == "accepted" and self.start_time <= now <= self.end_time

    def approve_rental(self):
        if self.status != "pending":
            raise ValidationError("Can only approve pending rental requests")
        
        self.status = "accepted"
        self.save()

    def reject_rental(self, reason=None):
        if self.status != "pending":
            raise ValidationError("Can only reject pending rental requests")
        
        self.status = "rejected"
        if reason:
            self.notes = reason
        self.save()

    def complete_rental(self):
        if self.status != "in_progress":
            raise ValidationError("Can only complete rentals that are in progress")
        
        self.status = "completed"
        self.save()
      
    def __str__(self):
        return f"Rental #{self.id} - {self.product.title} ({self.status})"


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


# class EscrowPayment(models.Model):
#     """
#     Represents an escrow payment for a rental.
#     """

#     ESCROW_STATUS_CHOICES = [
#         ("HELD", "Payment Held in Escrow"),
#         ("RELEASED", "Released to Owner"),
#         ("REFUNDED", "Refunded to Renter"),
#         ("DISPUTED", "Payment Disputed"),
#     ]
#     # Link escrow to a rental.
#     rental = models.ForeignKey(
#         Rental,
#         on_delete=models.CASCADE,
#         related_name="EscrowPayment"  # added related_name to avoid clash with Rental.escrow_payment
#     )
#     # Related payment record.
#     payment = models.OneToOneField(
#         Payment, on_delete=models.PROTECT, related_name="escrow_payment"
#     )
#     status = models.CharField(
#         max_length=20, choices=ESCROW_STATUS_CHOICES, default="HELD"
#     )
#     held_amount = models.DecimalField(max_digits=10, decimal_places=2)
#     release_date = models.DateTimeField(null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def release_to_owner(self):
#         # Release funds held in escrow to the product owner.
#         with transaction.atomic():
#             if self.status != "HELD":
#                 raise ValidationError(
#                     "Cannot release funds that are not held in escrow"
#                 )
#             self.status = "RELEASED"
#             self.release_date = timezone.now()
#             self.save()
#             Payment.objects.create(
#                 user=self.rental.owner,
#                 amount=self.held_amount,
#                 payment_method="BANK_TRANSFER",
#                 status="COMPLETED",
#                 description=f"Rental payment release for rental #{self.rental.id}",
#                 transaction_id=f"REL-{uuid.uuid4().hex[:8]}",
#             )

#     def refund_to_renter(self):
#         # Refund the held escrow funds to the renter.
#         with transaction.atomic():
#             if self.status != "HELD":
#                 raise ValidationError("Cannot refund funds that are not held in escrow")
#             self.status = "REFUNDED"
#             self.release_date = timezone.now()
#             self.save()
#             Payment.objects.create(
#                 user=self.rental.renter,
#                 amount=self.held_amount,
#                 payment_method="BANK_TRANSFER",
#                 status="REFUNDED",
#                 description=f"Rental payment refund for rental #{self.rental.id}",
#                 transaction_id=f"REF-{uuid.uuid4().hex[:8]}",
#             )

#     def dispute_payment(self, reason=None):
#         # Mark the payment as disputed.
#         with transaction.atomic():
#             if self.status != "HELD":
#                 raise ValidationError(
#                     "Cannot dispute funds that are not held in escrow"
#                 )
#             self.status = "DISPUTED"
#             self.save()
#             Dispute.objects.create(escrow_payment=self, reason=reason, status="OPEN")
