from django.db import models
from django.core.exceptions import ValidationError
from users.models import CustomUser
from advertisements.models import Product
from django.utils import timezone
from decimal import Decimal


class Rental(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('in_progress', 'In Progress')
    ]

    renter = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='rentals_as_renter')
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='rentals_as_owner')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='rentals')
    start_time = models.DateTimeField(help_text='When renting period starts')
    end_time = models.DateTimeField(help_text='When renting period ends')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, editable=False, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['owner']),
        ]

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time")
        if self.start_time < timezone.now():
            raise ValidationError("Start time cannot be in the past")

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
        return self.status == 'accepted' and self.start_time <= now <= self.end_time
