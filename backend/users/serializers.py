from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from .email_service import send_verification_email
from django.utils.translation import gettext_lazy as _
from .validators import (
    validate_profile_picture,
    validate_date_of_birth,
    validate_phone_number,
    validate_registration_data,
    validate_profile_completion,
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
        import time
        import logging
        logger = logging.getLogger('registration_timing')
        start_time = time.time()
        password = validated_data.pop("password1")
        validated_data.pop("password2")
        user_creation_start = time.time()
        user = CustomUser(
            username=validated_data.get("username"),
            email=validated_data.get("email"),
            marketing_consent=validated_data.get("marketing_consent", False),
            profile_completed=validated_data.get("profile_completed", False),
        )
        user.set_password(password)
        user.save()
        logger.info(f"User creation took {time.time() - user_creation_start:.2f}s")
        token_start = time.time()
        user.generate_verification_token()
        logger.info(f"Token generation took {time.time() - token_start:.2f}s")
        # Queue email sending task
        from users.tasks import send_verification_email_task
        request_meta = None
        if self.context.get('request'):
            request_meta = {
                'HTTP_HOST': self.context['request'].META.get('HTTP_HOST'),
                'HTTP_ORIGIN': self.context['request'].META.get('HTTP_ORIGIN'),
                'SCHEME': self.context['request'].scheme
            }
        email_start = time.time()
        send_verification_email_task.delay(user.id, request_meta)
        logger.info(f"Email queuing took {time.time() - email_start:.2f}s")
        logger.info(f"Total registration took {time.time() - start_time:.2f}s")
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
    bio = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    
    # Add explicit profile_picture field with validator
    profile_picture = serializers.ImageField(
        required=False,
        write_only=True,
        allow_null=True,
        validators=[validate_profile_picture]
    )

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
            "profile_completed",
            "profile_picture_url"  # This is computed, should be read-only
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

    def validate(self, data):
        """
        Validate the profile data.
        
        Args:
            data: The data to validate
            
        Returns:
            The validated data
        """
        print("\nValidating profile data:", data)
        
        # Handle profile picture upload
        profile_picture = data.get('profile_picture')
        if profile_picture:
            # Validate file size
            if profile_picture.size > 10 * 1024 * 1024:  # 10MB limit
                raise serializers.ValidationError({
                    'profile_picture': ['File size must be less than 10MB']
                })
            
            # Validate content type
            if not profile_picture.content_type.startswith('image/'):
                raise serializers.ValidationError({
                    'profile_picture': ['File must be an image']
                })

        return data

    def to_representation(self, instance):
        """
        Customize the representation of the serialized data.
        
        Args:
            instance: The user instance
            
        Returns:
            The serialized data with additional computed fields
        """
        data = super().to_representation(instance)
        return data
    
    def update(self, instance, validated_data):
        """
        Custom update method to properly handle all fields, including files.
        """
        # Handle profile_picture separately
        if 'profile_picture' in validated_data:
            profile_picture = validated_data.pop('profile_picture')
            instance.profile_picture = profile_picture
        
        # Update all other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Save the instance
        instance.save()
        
        return instance


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
        return validate_profile_completion(data)

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
        
        # Handle file fields separately
        if 'national_id_front' in validated_data:
            instance.national_id_front = validated_data.pop('national_id_front')
        if 'national_id_back' in validated_data:
            instance.national_id_back = validated_data.pop('national_id_back')
        
        # Update all other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
