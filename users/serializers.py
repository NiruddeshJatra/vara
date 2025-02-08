# Module: serializers - Defines serializers for user profile and registration.

from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
import re
from .models import CustomUser

class ProfilePictureSerializer(serializers.ModelSerializer):
    # Serializer for handling profile picture uploads.
    class Meta:
        model = CustomUser
        fields = ['profile_picture']

    def validate_profile_picture(self, value):
        # Validate file size and type.
        try:
            if value.size > 5 * 1024 * 1024:  # 5MB limit
                raise serializers.ValidationError("Image size cannot exceed 5MB")
            if value.content_type not in ['image/jpg', 'image/jpeg', 'image/png']:
                raise serializers.ValidationError("Only JPG, JPEG and PNG files are allowed")
        except AttributeError as e:
            raise serializers.ValidationError("Invalid file upload") from e
        return value

class CustomRegisterSerializer(RegisterSerializer):
    # Serializer extended for custom registration fields.
    username = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(required=True, max_length=15)
    location = serializers.CharField(required=True, max_length=255)
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)

    def custom_signup(self, request, user):
        # Saves additional attributes during registration.
        user.phone_number = self.validated_data.get("phone_number", "")
        user.location = self.validated_data.get("location", "")
        user.first_name = self.validated_data.get("first_name", "")
        user.last_name = self.validated_data.get("last_name", "")
        user.save()

    def validate_phone_number(self, phone_number):
        # Validate phone number against Bangladeshi format.
        if not re.match(r'^\+?88?01[5-9]\d{8}$', phone_number):
            raise serializers.ValidationError("Invalid phone number format")
        return phone_number
      
    def validate_email(self, email):
        # Ensure email uniqueness.
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email

class UserProfileSerializer(serializers.ModelSerializer):
    # Serializer for reading user profile details.
    full_name = serializers.SerializerMethodField()
    bio = serializers.CharField(required=False, max_length=500)
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'full_name', 'phone_number', 
            'location', 'profile_picture', 'date_of_birth', 'bio', 'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'email', 'is_verified', 'created_at']

    def get_full_name(self, obj):
        # Returns a concatenated string of first and last names.
        return f"{obj.first_name} {obj.last_name}".strip()
