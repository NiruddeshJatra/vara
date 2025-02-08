from django.db import models
from django.conf import settings
from decimal import Decimal


class Payment(models.Model):
    """
    Model representing a payment.
    """
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded')
    ]

    PAYMENT_METHOD_CHOICES = [
        ('CARD', 'Credit/Debit Card'),
        ('BANK_TRANSFER', 'Bank Transfer'),
        ('MOBILE_BANKING', 'Mobile Banking'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    description = models.TextField(blank=True)
    billing_address = models.JSONField(null=True, blank=True)
    payment_details = models.JSONField(null=True, blank=True)
    session_key = models.CharField(max_length=100, blank=True, null=True)
    ssl_status = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['user', 'status']),
        ]

    def __str__(self):
        return f"Payment {self.transaction_id or 'N/A'} - {self.status}"
      
    def clean(self):
        if self.amount <= Decimal('0'):
            raise ValidationError("Amount must be greater than zero.")
          
    def refund(self):
        if self.status != 'COMPLETED':
            raise ValidationError("Only completed payments can be refunded.")
        self.status = 'REFUNDED'
        self.save()

        Refund.objects.create(
            payment=self,
            amount=self.amount,
            status='COMPLETED'
        )
        
        
class Refund(models.Model):
    """
    Model representing a refund for a payment.
    """
    PAYMENT_STATUS_CHOICES = [
        ('COMPLETED', 'Completed'),
        ('REFUNDED', 'Refunded')
    ]
    payment = models.ForeignKey('payments.models.Payment', on_delete=models.PROTECT, related_name='refunds')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='REFUNDED')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Refund for Payment {self.payment.transaction_id or 'N/A'}"

class Dispute(models.Model):
    """
    Model representing a dispute for an escrow payment.
    """
    escrow_payment = models.ForeignKey('rentals.models.EscrowPayment', on_delete=models.PROTECT, related_name='disputes')
    reason = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, default="OPEN")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Dispute for EscrowPayment ID {self.escrow_payment.id}"