from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from .email_service import send_verification_email
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .validators import (
    validate_profile_picture,
    validate_date_of_birth,
    validate_phone_number
)


class ProfilePictureSerializer(serializers.ModelSerializer):
    """
    Serializer for handling profile picture uploads.
    
    This serializer validates the uploaded image size and format.
    """
    class Meta:
        model = CustomUser
        fields = ["profile_picture"]

    def validate_profile_picture(self, value):
        """
        Validate the profile picture file.
        
        Args:
            value: The uploaded file object
            
        Returns:
            The validated file object
            
        Raises:
            ValidationError: If the file size exceeds 5MB or if the file is invalid
        """
        return validate_profile_picture(value)


class CustomRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    
    This serializer handles the registration process, including password validation
    and user creation.
    """
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    marketing_consent = serializers.BooleanField(required=False, default=False)
    profile_completed = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "password1",
            "password2",
            "marketing_consent",
            "profile_completed",
        ]
        extra_kwargs = {
            'password1': {'write_only': True},
            'password2': {'write_only': True},
        }

    def validate(self, data):
        """
        Validate the registration data.
        
        Args:
            data: The data to validate
            
        Returns:
            The validated data
            
        Raises:
            ValidationError: If passwords don't match or username is already taken
        """
        return validate_registration_data(data)

    def create(self, validated_data):
        """
        Create a new user with the validated data.
        
        Args:
            validated_data: The validated registration data
            
        Returns:
            The created user instance
        """
        # Remove password fields from validated_data
        password = validated_data.pop("password1")
        validated_data.pop("password2")
        
        # Create user instance but don't save to database yet
        user = CustomUser(
            username=validated_data.get("username"),
            email=validated_data.get("email"),
            marketing_consent=validated_data.get("marketing_consent", False),
            profile_completed=validated_data.get("profile_completed", False),
        )
        
        # Set password properly
        user.set_password(password)
        user.save()
        
        # Generate verification token and send email
        user.generate_verification_token()
        send_verification_email(user, self.context.get('request'))
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for reading and updating user profile details.
    
    This serializer provides fields for user information, including
    computed fields like full_name and profile_picture_url.
    """
    full_name = serializers.SerializerMethodField()
    profile_picture_url = serializers.SerializerMethodField()
    member_since = serializers.SerializerMethodField()
    notification_count = serializers.SerializerMethodField()

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
            "profile_picture_url",
            "is_trusted",
            "average_rating",
            "member_since",
            "notification_count",
            "bio",
            "created_at",
            "date_of_birth",
            "profile_completed"
        ]
        read_only_fields = [
            "id",
            "username",
            "email",
            "created_at",
            "is_trusted",
            "average_rating",
            "member_since",
            "notification_count",
            "profile_completed"
        ]

    def get_full_name(self, obj):
        """
        Get the user's full name.
        
        Args:
            obj: The user instance
            
        Returns:
            The user's full name
        """
        return f"{obj.first_name} {obj.last_name}" if obj.first_name and obj.last_name else ""

    def get_profile_picture_url(self, obj):
        """
        Get the URL of the user's profile picture.
        
        Args:
            obj: The user instance
            
        Returns:
            The URL of the profile picture or None if not available
        """
        if obj.profile_picture:
            return obj.profile_picture.url
        return None

    def get_member_since(self, obj):
        """
        Get the user's member since date in a readable format.
        
        Args:
            obj: The user instance
            
        Returns:
            Formatted date string
        """
        return obj.created_at.strftime("%B %Y")

    def get_notification_count(self, obj):
        """
        Get the user's unread notification count.
        
        Args:
            obj: The user instance
            
        Returns:
            Number of unread notifications
        """
        return 2

    def validate_phone_number(self, phone_number):
        """
        Validate the phone number format.
        
        Args:
            phone_number: The phone number to validate
            
        Returns:
            The validated phone number
            
        Raises:
            ValidationError: If the phone number format is invalid
        """
        return validate_phone_number(phone_number)

    def validate_date_of_birth(self, date_of_birth):
        """
        Validate the date of birth.
        
        Args:
            date_of_birth: The date of birth to validate
            
        Returns:
            The validated date of birth
            
        Raises:
            ValidationError: If the date of birth is invalid
        """
        return validate_date_of_birth(date_of_birth)


class TokenSerializer(serializers.Serializer):
    """
    Serializer for returning JWT tokens upon email verification.
    
    This serializer provides access and refresh tokens for authenticated users.
    """
    access = serializers.CharField()
    refresh = serializers.CharField()

    @classmethod
    def get_token(cls, user):
        """
        Get JWT tokens for a user.
        
        Args:
            user: The user instance
            
        Returns:
            A dictionary containing access and refresh tokens
        """
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class ProfileCompletionSerializer(serializers.ModelSerializer):
    """
    Serializer for completing a user's profile.
    
    This serializer handles the profile completion process, including validation
    of required fields and updating the profile_completed flag.
    """
    class Meta:
        model = CustomUser
        fields = [
            "first_name",
            "last_name",
            "phone_number",
            "location",
            "date_of_birth",
            "national_id_number",
            "national_id_front",
            "national_id_back",
            "profile_completed",
        ]
        read_only_fields = ["profile_completed"]

    def validate_phone_number(self, phone_number):
        """
        Validate the phone number format.
        
        Args:
            phone_number: The phone number to validate
            
        Returns:
            The validated phone number
            
        Raises:
            ValidationError: If the phone number format is invalid
        """
        return validate_phone_number(phone_number)

    def validate(self, data):
        """
        Validate the profile completion data.
        
        Args:
            data: The data to validate
            
        Returns:
            The validated data
            
        Raises:
            ValidationError: If required fields are missing
        """
        # Ensure all required fields are present
        required_fields = [
            "first_name",
            "last_name",
            "phone_number",
            "location",
            "date_of_birth",
        ]
        
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({
                    field: _("{field} is required for profile completion").format(
                        field=field.replace('_', ' ').title()
                    )
                })
        
        return data

    def update(self, instance, validated_data):
        """
        Update the user's profile with the validated data.
        
        Args:
            instance: The user instance to update
            validated_data: The validated data
            
        Returns:
            The updated user instance
        """
        # Set profile_completed to True when all required fields are present
        validated_data["profile_completed"] = True
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

    def validate_national_id_number(self, value):
        """
        Validate the national ID number.
        
        Args:
            value: The national ID number to validate
            
        Returns:
            The validated national ID number
            
        Raises:
            ValidationError: If the national ID number is invalid
        """
        if value:
            # Check if the national ID number is already in use
            if CustomUser.objects.filter(national_id_number=value).exclude(id=self.instance.id if self.instance else None).exists():
                raise serializers.ValidationError(_("This national ID number is already registered"))
        return value
