from rest_framework import serializers
import re
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken


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


class CustomRegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    terms_agreed = serializers.BooleanField(required=True)
    marketing_consent = serializers.BooleanField(required=False, default=False)
    profile_completed = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "password1",
            "password2",
            "terms_agreed",
            "marketing_consent",
            "profile_completed",
        ]

    def validate(self, data):
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
        # Remove password2 and other fields from validated_data
        validated_data.pop("password2", None)
        terms_agreed = validated_data.pop("terms_agreed", False)
        marketing_consent = validated_data.pop("marketing_consent", False)
        profile_completed = validated_data.pop("profile_completed", False)

        # Create user with hashed password
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password1"],
            terms_agreed=terms_agreed,
            marketing_consent=marketing_consent,
            profile_completed=profile_completed,
        )

        # Generate verification token
        user.generate_verification_token()
        user.save()

        # Send verification email
        from .email_service import send_verification_email

        send_verification_email(user, self.context.get("request"))

        return user


class UserProfileSerializer(serializers.ModelSerializer):
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
            "terms_agreed",
            "marketing_consent",
            "profile_completed",
            "is_email_verified",
        ]
        read_only_fields = [
            "id",
            "email",
            "created_at",
            "is_trusted",
            "terms_agreed",
            "marketing_consent",
            "profile_completed",
            "is_email_verified",
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_profile_picture_url(self, obj):
        request = self.context.get("request")
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None

    def validate_phone_number(self, phone_number):
        if not phone_number:
            return phone_number

        if not re.match(r"^(\+?88)?01[5-9]\d{8}$", phone_number):
            raise serializers.ValidationError(
                "Phone number must be 10-15 digits with optional + prefix"
            )
        return phone_number

    def validate_date_of_birth(self, date_of_birth):
        if not date_of_birth:
            return date_of_birth

        from datetime import date

        today = date.today()
        age = (
            today.year
            - date_of_birth.year
            - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
        )
        if age < 18:
            raise serializers.ValidationError("You must be at least 18 years old")
        return date_of_birth


class TokenSerializer(serializers.Serializer):
    """Serializer for returning JWT tokens upon email verification"""

    access = serializers.CharField()
    refresh = serializers.CharField()

    @classmethod
    def get_token(cls, user):
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class ProfileCompletionSerializer(serializers.ModelSerializer):
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
        if not phone_number:
            raise serializers.ValidationError(
                "Phone number is required for profile completion"
            )

        if not re.match(r"^(\+?88)?01[5-9]\d{8}$", phone_number):
            raise serializers.ValidationError(
                "Phone number must be 10-15 digits with optional + prefix"
            )

        return phone_number

    def validate(self, data):
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
                raise serializers.ValidationError(
                    f"{field.replace('_', ' ').title()} is required for profile completion"
                )

        # Validate national ID fields
        if not data.get("national_id_number"):
            raise serializers.ValidationError(
                "National ID number is required for profile completion"
            )
        if not data.get("national_id_front"):
            raise serializers.ValidationError(
                "National ID front image is required for profile completion"
            )
        if not data.get("national_id_back"):
            raise serializers.ValidationError(
                "National ID back image is required for profile completion"
            )

        # Validate date of birth (must be 18 or older)
        if data.get("date_of_birth"):
            from datetime import date

            today = date.today()
            age = (
                today.year
                - data["date_of_birth"].year
                - (
                    (today.month, today.day)
                    < (data["date_of_birth"].month, data["date_of_birth"].day)
                )
            )
            if age < 18:
                raise serializers.ValidationError("You must be at least 18 years old")

        return data

    def update(self, instance, validated_data):
        # Set profile_completed to True when all required fields are present
        validated_data["profile_completed"] = True
        return super().update(instance, validated_data)
