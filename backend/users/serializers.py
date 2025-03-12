from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
import re
from .models import CustomUser


class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["profile_picture"]

    def validate_profile_picture(self, value):
        try:
            if value.size > 5 * 1024 * 1024:  # 5MB limit
                raise serializers.ValidationError("Image size cannot exceed 5MB")
        
        except AttributeError as e:
            raise serializers.ValidationError(
                "Invalid file upload"
            ) from e  # TODO: have to check why e is used here

        return value


class CustomRegisterSerializer(RegisterSerializer): 
    # Overrided to add custom functionality because the default create method only has fields like username, email, and password.
    username = serializers.CharField(required=True, max_length=150)
    phone_number = serializers.CharField(required=True, max_length=15)
    location = serializers.CharField(required=True, max_length=255)
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    date_of_birth = serializers.DateField(required=False)

    def custom_signup(self, request, user):
        # Saves additional attributes during registration.
        user.phone_number = self.validated_data.get("phone_number", "")
        user.location = self.validated_data.get("location", "")
        user.first_name = self.validated_data.get("first_name", "")
        user.last_name = self.validated_data.get("last_name", "")
        user.date_of_birth = self.validated_data.get('date_of_birth', None)
        user.save()

    def validate_phone_number(self, phone_number):
        # Validate phone number against Bangladeshi format.
        if not re.match(r"^(\+?88)?01[5-9]\d{8}$", phone_number):
            raise serializers.ValidationError("Invalid phone number format")

        return phone_number
      
    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'phone_number': self.validated_data.get('phone_number', ''),
            'location': self.validated_data.get('location', ''),
            'date_of_birth': self.validated_data.get('date_of_birth', None)
        }


class UserProfileSerializer(serializers.ModelSerializer):
    # Serializer for reading user profile details.
    full_name = serializers.SerializerMethodField()
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone_number",
            "location",
            "profile_picture",
            'profile_picture_url',
            "date_of_birth",
            "bio",
            "is_verified",
            "created_at",
            "is_trusted_seller",
        ]
        read_only_fields = ["id", "email", "is_verified", "created_at","is_trusted"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
    
    # ensures that the profile picture URLs are correctly generated and accessible from the frontend.
    def get_profile_picture_url(self, obj):
        request = self.context.get("request")
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None
