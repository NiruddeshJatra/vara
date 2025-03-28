from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Avg
from django.core.validators import (
    MinValueValidator,
    FileExtensionValidator,
    MaxValueValidator,
)


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, db_index=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True, unique=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", null=True, blank=True, validators=[FileExtensionValidator(["jpg", "jpeg", "png"])]
    )
    date_of_birth = models.DateField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)
    is_trusted = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=255, blank=True, null=True)
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        editable=False,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.username

    # BLACKBOX - depends on "reviews_received" relationship, don't know how aggregate and Avg work together
    # TODO: recheck this later
    def update_average_rating(self):
        from reviews.models import Review

        avg = (
            Review.objects.filter(
                review_type="user", reviewed_user=self
            ).aggregate(Avg("rating"))["rating__avg"]
            or 0
        )
        self.average_rating = round(avg, 2)
        self.save(update_fields=["average_rating"])


