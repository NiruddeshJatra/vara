from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Avg
from django.core.validators import FileExtensionValidator
import uuid
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    """
    CustomUser model extends Django's AbstractUser to provide additional fields
    and functionality for user management in the application.
    
    This model includes fields for user profile information, authentication,
    verification, and trust status.
    """
    email = models.EmailField(
        unique=True, 
        db_index=True,
        help_text=_("User's email address, used as the primary identifier for login")
    )
    phone_number = models.CharField(
        max_length=15, 
        blank=True, 
        null=True,
        help_text=_("User's contact phone number")
    )
    location = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text=_("User's location or address")
    )
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", 
        null=True, 
        blank=True, 
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
        help_text=_("User's profile picture (JPEG or PNG format)")
    )
    date_of_birth = models.DateField(
        null=True, 
        blank=True,
        help_text=_("User's date of birth")
    )
    bio = models.TextField(
        null=True, 
        blank=True,
        help_text=_("User's biographical information or description")
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text=_("When the user account was created")
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text=_("When the user account was last updated")
    )
    is_trusted = models.BooleanField(
        default=False,
        help_text=_("Indicates if the user has been verified as trustworthy by admins")
    )
    is_email_verified = models.BooleanField(
        default=False,
        help_text=_("Indicates if the user's email has been verified")
    )
    email_verification_token = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text=_("Token used for email verification")
    )
    marketing_consent = models.BooleanField(
        default=False,
        help_text=_("Indicates if the user has consented to receive marketing communications")
    )
    profile_completed = models.BooleanField(
        default=False,
        help_text=_("Indicates if the user has completed their profile with required information")
    )
    national_id_number = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        unique=True,
        help_text=_("User's national ID number (must be unique)")
    )
    national_id_front = models.ImageField(
        upload_to="national_ids/front/", 
        null=True, 
        blank=True, 
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
        help_text=_("Front image of user's national ID document")
    )
    national_id_back = models.ImageField(
        upload_to="national_ids/back/", 
        null=True, 
        blank=True, 
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
        help_text=_("Back image of user's national ID document")
    )
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        editable=False,
        help_text=_("User's average rating from reviews")
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.username

    def generate_verification_token(self):
        """
        Generate a unique token for email verification.
        
        Returns:
            str: The generated verification token
        """
        token = str(uuid.uuid4())
        self.email_verification_token = token
        self.save(update_fields=["email_verification_token"])
        return token

    def get_verification_url(self, request=None):
        """
        Generate the complete verification URL to be sent in the email.
        
        Args:
            request: Optional request object to determine the domain
            
        Returns:
            str: The complete verification URL
        """
        frontend_url = settings.FRONTEND_URL
        return f"{frontend_url}/auth/verify-email/{self.email_verification_token}/"

    def verify_email(self):
        """
        Mark the user's email as verified and clear the verification token.
        """
        self.is_email_verified = True
        self.email_verification_token = None  # Clear the token after use
        self.save(update_fields=["is_email_verified", "email_verification_token"])

    def update_average_rating(self):
        """
        Update the user's average rating based on all reviews received.
        This method calculates the average rating from all reviews where this user
        is the reviewed user.
        """
        from reviews.models import Review

        avg = (
            Review.objects.filter(
                review_type="user", reviewed_user=self
            ).aggregate(Avg("rating"))["rating__avg"]
            or 0
        )
        self.average_rating = round(avg, 2)
        self.save(update_fields=["average_rating"])