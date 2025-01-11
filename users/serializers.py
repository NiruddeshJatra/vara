from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers


class CustomRegisterSerializer(RegisterSerializer):
    phone_number = serializers.CharField(required=True, max_length=15)
    location = serializers.CharField(required=True, max_length=255)

    def custom_signup(self, request, user):
        user.phone_number = self.validated_data.get("phone_number", "")
        user.location = self.validated_data.get("location", "")
        user.save()
        
    def validate_phone_number(self, phone_number):
        if not re.match(r'^\+?88?01[5-9]\d{8}$', phone_number):
            raise serializers.ValidationError("Invalid phone number format")
        return phone_number


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['phone_number', 'location', 'profile_picture', 'date_of_birth', 'bio', 'social_links']
