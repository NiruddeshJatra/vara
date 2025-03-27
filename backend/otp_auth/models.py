from django.db import models
from django.utils import timezone
import random
import string
from django.conf import settings
from datetime import timedelta


class PhoneOTP(models.Model):
    """
    Model to store OTP codes sent to phone numbers for verification
    """
    phone_number = models.CharField(max_length=15, unique=True, db_index=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    attempts = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name = "Phone OTP"
        verbose_name_plural = "Phone OTPs"
    
    def __str__(self):
        return f"{self.phone_number} - {self.otp}"
    
    def is_valid(self):
        """Check if OTP is still valid (within expiry time and max attempts not reached)"""
        expiry_time = self.created_at + timedelta(minutes=10)  # OTP valid for 10 minutes
        return (
            timezone.now() <= expiry_time and 
            self.attempts < 3 and  # Max 3 attempts allowed
            not self.is_verified
        )
    
    def validate_otp(self, otp):
        """Validate the provided OTP and mark as verified if correct"""
        if not self.is_valid():
            return False
        
        self.attempts += 1
        if str(self.otp) == str(otp):
            self.is_verified = True
            self.save()
            return True
        
        self.save()  # Save the updated attempts count
        return False
    
    @classmethod
    def generate_otp(cls):
        """Generate a random 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=6))
