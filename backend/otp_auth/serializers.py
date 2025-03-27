from rest_framework import serializers
from .models import PhoneOTP
import re


class SendOTPSerializer(serializers.Serializer):
    """Serializer for sending OTP"""
    phone_number = serializers.CharField(max_length=15)
    
    def validate_phone_number(self, value):
        # Validate phone number format (10-15 digits with optional + prefix)
        if not re.match(r"^\+?[0-9]{10,15}$", value):
            raise serializers.ValidationError("Phone number must be 10-15 digits with optional + prefix")
        return value


class VerifyOTPSerializer(serializers.Serializer):
    """Serializer for verifying OTP"""
    phone_number = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)
    
    def validate_phone_number(self, value):
        # Validate phone number format (10-15 digits with optional + prefix)
        if not re.match(r"^\+?[0-9]{10,15}$", value):
            raise serializers.ValidationError("Phone number must be 10-15 digits with optional + prefix")
        return value
    
    def validate_otp(self, value):
        # Validate OTP format (6 digits)
        if not re.match(r"^[0-9]{6}$", value):
            raise serializers.ValidationError("OTP must be 6 digits")
        return value
    
    def validate(self, data):
        # Check if there's an OTP record for this phone number
        try:
            phone_otp = PhoneOTP.objects.get(phone_number=data['phone_number'])
        except PhoneOTP.DoesNotExist:
            raise serializers.ValidationError({"phone_number": "No OTP has been sent to this phone number"})
        
        # Check if OTP is valid
        if not phone_otp.is_valid():
            if phone_otp.attempts >= 3:
                raise serializers.ValidationError({"otp": "Too many failed attempts. Please request a new OTP"})
            elif phone_otp.is_verified:
                raise serializers.ValidationError({"otp": "This OTP has already been verified"})
            else:
                raise serializers.ValidationError({"otp": "OTP has expired. Please request a new one"})
        
        return data
