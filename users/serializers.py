from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
import re
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from .models import CustomUser

class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['profile_picture']

    def validate_profile_picture(self, value):
        try:
            if value.size > 5 * 1024 * 1024:  # 5MB limit
                raise serializers.ValidationError("Image size cannot exceed 5MB")
            if value.content_type not in ['image/jpeg', 'image/png']:
                raise serializers.ValidationError("Only JPEG and PNG files are allowed")
        except AttributeError as e:
            raise serializers.ValidationError("Invalid file upload") from e
        return value


class SocialLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['social_links']

    def validate_social_links(self, value):
        url_validator = URLValidator()
        allowed_platforms = ['linkedin', 'twitter', 'facebook', 'github']

        if not isinstance(value, dict):
            raise serializers.ValidationError("Social links must be provided as a dictionary of platform-URL pairs")

        for platform, url in value.items():
            if platform not in allowed_platforms:
                raise serializers.ValidationError(f"Invalid platform '{platform}'. Allowed platforms are: {', '.join(allowed_platforms)}")
            try:
                url_validator(url)
            except ValidationError as e:
                raise serializers.ValidationError(
                    f"Invalid URL '{url}' for platform '{platform}'"
                ) from e

        return value


class CustomRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(required=True, max_length=15)
    location = serializers.CharField(required=True, max_length=255)
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)

    def custom_signup(self, request, user):
        user.phone_number = self.validated_data.get("phone_number", "")
        user.location = self.validated_data.get("location", "")
        user.first_name = self.validated_data.get("first_name", "")
        user.last_name = self.validated_data.get("last_name", "")
        user.save()

    def validate_phone_number(self, phone_number):
        if not re.match(r'^\+?88?01[5-9]\d{8}$', phone_number):
            raise serializers.ValidationError("Invalid phone number format")
        return phone_number
      
    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    bio = serializers.CharField(required=False, max_length=500)
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'full_name', 'phone_number', 
            'location', 'profile_picture', 'date_of_birth', 'bio', 
            'social_links', 'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'email', 'is_verified', 'created_at']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
