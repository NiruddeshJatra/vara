from rest_framework import serializers
import re
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from .email_service import send_verification_email


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
        try:
            if value.size > 5 * 1024 * 1024:  # 5MB limit
                raise serializers.ValidationError("Image size cannot exceed 5MB")
        
        except AttributeError as e:
            raise serializers.ValidationError(
                "Invalid file upload"
            ) from e

        return value


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
        # Check if passwords match
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("Passwords do not match")

        # Check if username is already taken
        if CustomUser.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError("Username is already taken")

        # Check if email is already taken
        if CustomUser.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("Email is already registered")

        return data

    def create(self, validated_data):
        """
        Create a new user with the validated data.
        
        Args:
            validated_data: The validated registration data
            
        Returns:
            The created user instance
        """
        # Remove password2 and other fields from validated_data
        password = validated_data.pop("password1", None)
        validated_data.pop("password2", None)
        
        # Create the user
        user = CustomUser.objects.create_user(
            username=validated_data.get("username"),
            email=validated_data.get("email"),
            password=password,
            marketing_consent=validated_data.get("marketing_consent", False),
            profile_completed=validated_data.get("profile_completed", False),
        )
        
        # Generate verification token and send email
        user.generate_verification_token()
        send_verification_email(user, self.context.get('request'))
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for reading and updating basic user profile details.
    
    This serializer provides fields for basic user information and includes
    computed fields like full_name and profile_picture_url.
    """
    # Serializer for reading and updating basic user profile details
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
            "profile_picture_url",
            "date_of_birth",
            "bio",
            "created_at",
            "is_trusted",
            "marketing_consent",
            "profile_completed",
            "is_email_verified",
        ]
        read_only_fields = [
            "id",
            "username",
            "email",
            "created_at",
            "is_trusted",
            "is_email_verified",
        ]

    def get_full_name(self, obj):
        """
        Get the user's full name.
        
        Args:
            obj: The user instance
            
        Returns:
            The user's full name or an empty string if not available
        """
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}"
        return ""

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
        if phone_number:
            # Basic phone number validation (can be enhanced)
            if not re.match(r'^\+?1?\d{9,15}$', phone_number):
                raise serializers.ValidationError("Invalid phone number format")
        return phone_number

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
        from datetime import date
        
        if date_of_birth:
            today = date.today()
            age = today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
            
            if age < 18:
                raise serializers.ValidationError("You must be at least 18 years old to use this service")
            
            if age > 120:
                raise serializers.ValidationError("Please enter a valid date of birth")
                
        return date_of_birth


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
        if phone_number:
            if not re.match(r"^(\+?88)?01[5-9]\d{8}$", phone_number):
                raise serializers.ValidationError("Invalid phone number format")
        return phone_number

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
                    field: f"{field.replace('_', ' ').title()} is required for profile completion"
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
                raise serializers.ValidationError("This national ID number is already registered")
        return value
