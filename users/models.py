from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_pictures/", null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    social_links = models.JSONField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        ordering = ['-date_joined']
    def __str__(self):
        return self.username
