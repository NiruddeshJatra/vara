from django.db import models, transaction
from django.core.exceptions import ValidationError
from users.models import CustomUser
from payments.models import Payment
from advertisements.models import Product
from django.utils import timezone
from decimal import Decimal


class Rental(models.Model):
    """
    Model representing a rental.
    """

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
        Product, on_delete=models.CASCADE, related_name="rentals"
    )
    start_time = models.DateTimeField(help_text="When renting period starts")
    end_time = models.DateTimeField(help_text="When renting period ends")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="pending")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    security_deposit = models.DecimalField(
        max_digits=10, decimal_places=2, editable=False, null=True, blank=True
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["owner", "renter"]),
        ]

    def clean(self):
        super().clean()
        if not self.product.check_availability(self.start_time, self.end_time):
            raise ValidationError(
                "The product is not available for the selected time period."
            )

    def calculate_total_price(self):
        duration = self.end_time - self.start_time
        total_hours = duration.total_seconds() / 3600
        pricing = self.product.pricingoption
        price_per_unit = Decimal(pricing.price_per_unit)
        total_price = total_hours * price_per_unit
        return round(total_price, 2)

    def save(self, *args, **kwargs):
        self.clean()
        self.owner = self.product.owner
        self.security_deposit = self.product.security_deposit
        self.total_price = self.calculate_total_price()
        super().save(*args, **kwargs)

    @property
    def is_active(self):
        now = timezone.now()
        return self.status == "accepted" and self.start_time <= now <= self.end_time

    def approve_rental(self, payment_data):
        """
        Approve a rental request and create escrow payment.
        """
        if self.status != "pending":
            raise ValidationError("Can only approve pending rental requests")

        with transaction.atomic():
            payment = Payment.objects.create(
                user=self.renter,
                amount=self.total_price + self.security_deposit,
                payment_method=payment_data["payment_method"],
                status="PROCESSING",
                description=f"Payment for rental #{self.id}",
                billing_address=payment_data.get("billing_address"),
                payment_details=payment_data.get("payment_details"),
            )

            EscrowPayment.objects.create(
                rental=self,
                payment=payment,
                held_amount=self.total_price + self.security_deposit,
            )

            self.status = "accepted"
            self.save()

            return payment

    def reject_rental(self, reason=None):
        """
        Reject a rental request.
        """
        if self.status != "pending":
            raise ValidationError("Can only reject pending rental requests")

        self.status = "rejected"
        if reason:
            self.notes = reason
        self.save()

    def complete_rental(self):
        """
        Complete a rental and release payment from escrow.
        """
        if self.status != "in_progress":
            raise ValidationError("Can only complete rentals that are in progress")

        with transaction.atomic():
            self.status = "completed"
            self.save()

            escrow_payment = self.escrow_payment
            escrow_payment.release_to_owner()

    def check_availability(self):
        """
        Check if the product is available for the requested time period.
        """
        overlapping_rentals = Rental.objects.filter(
            product=self.product,
            status__in=["accepted", "in_progress"],
            start_time__lt=self.end_time,
            end_time__gt=self.start_time,
        ).exclude(id=self.id)

        return not overlapping_rentals.exists()


class EscrowPayment(models.Model):
    """
    Model representing an escrow payment.
    """

    ESCROW_STATUS_CHOICES = [
        ("HELD", "Payment Held in Escrow"),
        ("RELEASED", "Released to Owner"),
        ("REFUNDED", "Refunded to Renter"),
        ("DISPUTED", "Payment Disputed"),
    ]

    rental = models.OneToOneField(
        Rental, on_delete=models.PROTECT, related_name="escrow_payment"
    )
    payment = models.OneToOneField(Payment, on_delete=models.PROTECT)
    status = models.CharField(
        max_length=20, choices=ESCROW_STATUS_CHOICES, default="HELD"
    )
    held_amount = models.DecimalField(max_digits=10, decimal_places=2)
    release_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def release_to_owner(self):
        with transaction.atomic():
            if self.status != "HELD":
                raise ValidationError(
                    "Cannot release funds that are not held in escrow"
                )
            self.status = "RELEASED"
            self.release_date = timezone.now()
            self.save()

            Payment.objects.create(
                user=self.rental.owner,
                amount=self.held_amount,
                payment_method="BANK_TRANSFER",
                status="COMPLETED",
                description=f"Rental payment release for rental #{self.rental.id}",
                transaction_id=f"REL-{uuid.uuid4().hex[:8]}",
            )

    def refund_to_renter(self):
        with transaction.atomic():
            if self.status != "HELD":
                raise ValidationError("Cannot refund funds that are not held in escrow")
            self.status = "REFUNDED"
            self.release_date = timezone.now()
            self.save()

            Payment.objects.create(
                user=self.rental.renter,
                amount=self.held_amount,
                payment_method="BANK_TRANSFER",
                status="REFUNDED",
                description=f"Rental payment refund for rental #{self.rental.id}",
                transaction_id=f"REF-{uuid.uuid4().hex[:8]}",
            )

    def dispute_payment(self, reason=None):
        with transaction.atomic():
            if self.status != "HELD":
                raise ValidationError(
                    "Cannot dispute funds that are not held in escrow"
                )
            self.status = "DISPUTED"
            self.save()

            Dispute.objects.create(escrow_payment=self, reason=reason, status="OPEN")
