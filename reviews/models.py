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
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        # Ensure one review per rental per type per reviewer
        unique_together = ['reviewer', 'rental', 'review_type']
        indexes = [
            models.Index(fields=['review_type', 'created_at']),
            models.Index(fields=['reviewer', 'rental']),
        ]

    def clean(self):
        from django.core.exceptions import ValidationError
        
        # Ensure rental is completed
        if self.rental.status != 'completed':
            raise ValidationError("Can only review completed rentals")
        
        # Ensure reviewer was part of the rental
        if self.reviewer not in [self.rental.renter, self.rental.owner]:
            raise ValidationError("Only rental participants can leave reviews")
        
        # For property reviews, only renters can review
        if self.review_type == 'property' and self.reviewer != self.rental.renter:
            raise ValidationError("Only renters can review properties")
        
        # For user reviews, ensure reviewing the other party
        if self.review_type == 'user':
            if self.reviewer == self.rental.renter:
                self.reviewed_user = self.rental.owner
            else:
                self.reviewed_user = self.rental.renter

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

        # Update average ratings
        if self.review_type == 'property':
            self.rental.product.update_average_rating()
        elif self.reviewer == self.rental.renter:
            self.rental.owner.update_average_rating()
        else:
            self.rental.renter.update_average_rating()