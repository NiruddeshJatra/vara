# models.py
from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator
from django.utils import timezone
from django.core.exceptions import ValidationError
from users.models import CustomUser
from rentals.models import Rental

class Complaint(models.Model):
    class ComplaintStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        UNDER_REVIEW = 'under_review', 'Under Review'
        RESOLVED = 'resolved', 'Resolved'
        CANCELLED = 'cancelled', 'Cancelled'
        ESCALATED = 'escalated', 'Escalated'

    class ComplaintPriority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
        URGENT = 'urgent', 'Urgent'

    class ComplaintCategory(models.TextChoices):
        PAYMENT = 'payment', 'Payment Issue'
        PROPERTY = 'property', 'Property Condition'
        BEHAVIOR = 'behavior', 'User Behavior'
        SERVICE = 'service', 'Service Quality'
        OTHER = 'other', 'Other'

    # Basic Fields
    complainant = models.ForeignKey(CustomUser, 
        on_delete=models.PROTECT,
        related_name='filed_complaints'
    )
    against_user = models.ForeignKey(
        CustomUser,
        on_delete=models.PROTECT,
        related_name='complaints_received'
    )
    rental_request = models.ForeignKey(
        Rental,
        on_delete=models.PROTECT,
        related_name='complaints'
    )

    # Complaint Details
    title = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(10, "Title must be at least 10 characters long")]
    )
    category = models.CharField(
        max_length=50,
        choices=ComplaintCategory.choices,
        default=ComplaintCategory.OTHER
    )
    description = models.TextField(
        validators=[MinLengthValidator(20, "Description must be at least 20 characters long")]
    )
    evidence = models.JSONField(
        null=True,
        blank=True,
        help_text="Store URLs or references to uploaded evidence"
    )

    # Status and Priority
    status = models.CharField(
        max_length=50,
        choices=ComplaintStatus.choices,
        default=ComplaintStatus.PENDING
    )
    priority = models.CharField(
        max_length=50,
        choices=ComplaintPriority.choices,
        default=ComplaintPriority.MEDIUM
    )

    # Administrative Fields
    assigned_to = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_complaints'
    )
    admin_notes = models.TextField(blank=True, null=True)
    resolution_notes = models.TextField(blank=True, null=True)
    resolution_date = models.DateTimeField(null=True, blank=True)

    # Tracking Fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_status_change = models.DateTimeField(auto_now_add=True)
    response_deadline = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['complainant']),
            models.Index(fields=['against_user']),
            models.Index(fields=['priority', 'status']),
            models.Index(fields=['category']),
            models.Index(fields=['assigned_to']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['complainant', 'against_user', 'rental_request'], 
                name='unique_complaint_per_rental'
            ),
            models.CheckConstraint(
                check=models.Q(response_deadline__gt=models.F('created_at')),
                name='response_deadline_after_creation'
            )
        ]
        permissions = [
            ("can_escalate_complaint", "Can escalate complaint"),
            ("can_assign_complaint", "Can assign complaint"),
            ("can_view_all_complaints", "Can view all complaints"),
        ]

    def __str__(self):
        return f"Complaint #{self.id} - {self.title} ({self.status})"

    def clean(self):
        # Validate that resolution date is only set for resolved complaints
        if self.resolution_date and self.status != self.ComplaintStatus.RESOLVED:
            raise ValidationError({
                'resolution_date': 'Resolution date can only be set for resolved complaints'
            })
        
        # Validate that assigned_to user has proper permissions
        if self.assigned_to and not self.assigned_to.has_perm('can_handle_complaints'):
            raise ValidationError({
                'assigned_to': 'Selected user does not have permission to handle complaints'
            })
            
        if self.response_deadline and self.response_deadline <= self.created_at:
            raise ValidationError("Response deadline must be after creation date.")

    def save(self, *args, **kwargs):
        # Set response deadline based on priority if not set
        if not self.response_deadline:
            deadline_days = {
                self.ComplaintPriority.URGENT: 1,
                self.ComplaintPriority.HIGH: 3,
                self.ComplaintPriority.MEDIUM: 7,
                self.ComplaintPriority.LOW: 14,
            }
            days = deadline_days.get(self.priority, 7)
            self.response_deadline = timezone.now() + timezone.timedelta(days=days)

        # Update last_status_change if status has changed
        if self.pk:
            old_instance = Complaint.objects.get(pk=self.pk)
            if old_instance.status != self.status:
                self.last_status_change = timezone.now()

        # Set resolution date when status changes to resolved
        if self.status == self.ComplaintStatus.RESOLVED and not self.resolution_date:
            self.resolution_date = timezone.now()

        super().save(*args, **kwargs)
        
    def escalate(self):
        if self.status != self.ComplaintStatus.IN_PROGRESS:
            raise ValidationError("Only in-progress complaints can be escalated.")
        self.status = self.ComplaintStatus.ESCALATED
        self.save()

class ComplaintUpdate(models.Model):
    """Model to track updates and communication regarding complaints"""
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='updates')
    user = models.ForeignKey(CustomUser, on_delete=models.PROTECT)
    message = models.TextField()
    attachment = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['complaint', 'created_at']),
        ]

    def __str__(self):
        return f"Update on Complaint #{self.complaint.id} by {self.user.username}"