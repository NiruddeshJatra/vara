from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg
from users.models import CustomUser
from advertisements.models import Product
from rentals.models import Rental

class Review(models.Model):
    REVIEW_TYPES = [
        ('user', 'User Review'),
        ('property', 'Property Review'),
    ]

    reviewer = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='reviews_given'
    )
    rental = models.ForeignKey(
        Rental,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    review_type = models.CharField(
        max_length=10,
        choices=REVIEW_TYPES
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    reviewed_user = models.ForeignKey(
        CustomUser,
        null=True,
        blank=True,
        related_name='reviews_received',
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        # Ensure one review per rental per type per reviewer
        unique_together = ['reviewer', 'rental', 'review_type']
        indexes = [
            models.Index(fields=['review_type', 'rating']),
            models.Index(fields=['reviewer', 'reviewed_user']),
        ]

    def clean(self):
        from django.core.exceptions import ValidationError
        
        # Validate that the rental is completed.
        if self.rental.status != 'completed':
            raise ValidationError("Can only review completed rentals")
        
        # Validate that the reviewer was involved in the rental.
        if self.reviewer not in [self.rental.renter, self.rental.owner]:
            raise ValidationError("Only rental participants can leave reviews")
        
        # For property reviews, ensure only renters can submit.
        if self.review_type == 'property' and self.reviewer != self.rental.renter:
            raise ValidationError("Only renters can review properties")
        
        # For user reviews, automatically assign the reviewed user.
        if self.review_type == 'user':
            if self.reviewer == self.rental.renter:
                self.reviewed_user = self.rental.owner
            else:
                self.reviewed_user = self.rental.renter

    def save(self, *args, **kwargs):
        self.clean()  # Ensure data integrity before saving
        super().save(*args, **kwargs)

        # Update average ratings after saving the review.
        if self.review_type == 'property':
            self.rental.product.update_average_rating()  # Update product rating
        elif self.review_type == 'user':
            self.reviewed_user.update_average_rating()  # Update user rating