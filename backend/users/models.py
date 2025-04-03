from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Avg
from django.core.validators import FileExtensionValidator
import uuid
from django.conf import settings


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, db_index=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", null=True, blank=True, validators=[FileExtensionValidator(["jpg", "jpeg", "png"])]
    )
    date_of_birth = models.DateField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_trusted = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=255, blank=True, null=True)
    marketing_consent = models.BooleanField(default=False)
    profile_completed = models.BooleanField(default=False)
    national_id_number = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        unique=True,
        help_text="User's national ID number (must be unique)"
    )
    national_id_front = models.ImageField(
        upload_to="national_ids/front/", null=True, blank=True, validators=[FileExtensionValidator(["jpg", "jpeg", "png"])]
    )
    national_id_back = models.ImageField(
        upload_to="national_ids/back/", null=True, blank=True, validators=[FileExtensionValidator(["jpg", "jpeg", "png"])]
    )
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

    def generate_verification_token(self):
        """Generate a unique token for email verification"""
        token = str(uuid.uuid4())
        self.email_verification_token = token
        self.save(update_fields=["email_verification_token"])
        return token

    def get_verification_url(self, request=None):
        """Generate the complete verification URL to be sent in the email"""
        frontend_url = settings.FRONTEND_URL
        return f"{frontend_url}/auth/verify-email/{self.email_verification_token}/"

    def verify_email(self):
        """Mark the user's email as verified"""
        self.is_email_verified = True
        self.email_verification_token = None  # Clear the token after use
        self.save(update_fields=["is_email_verified", "email_verification_token"])

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