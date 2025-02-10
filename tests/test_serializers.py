from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from users.serializers import ProfilePictureSerializer, CustomRegisterSerializer, UserProfileSerializer

User = get_user_model()

class SerializersTest(TestCase):
    def test_profile_picture_validation(self):
        # Test file exceeding 5MB
        large_file = SimpleUploadedFile("large.png", b"0" * (5 * 1024 * 1024 + 1), content_type="image/png")
        serializer = ProfilePictureSerializer(data={"profile_picture": large_file})
        self.assertFalse(serializer.is_valid())
        self.assertIn("cannot exceed", str(serializer.errors))

        # Test invalid content type
        file_wrong = SimpleUploadedFile("file.txt", b"content", content_type="text/plain")
        serializer = ProfilePictureSerializer(data={"profile_picture": file_wrong})
        self.assertFalse(serializer.is_valid())

        # Test valid image upload (simulate update with an instance)
        valid_file = SimpleUploadedFile("valid.png", b"\x47\x49\x46", content_type="image/png")
        user = User.objects.create_user(email="ser@example.com", password="pass123", username="seruser")
        serializer = ProfilePictureSerializer(instance=user, data={"profile_picture": valid_file})
        self.assertTrue(serializer.is_valid())

    def test_custom_register_serializer(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "phone_number": "+8801755555555",
            "location": "Dhaka",
            "first_name": "New",
            "last_name": "User",
            "password1": "strongpassword",
            "password2": "strongpassword"
        }
        serializer = CustomRegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())

        # Test invalid phone number
        data["phone_number"] = "12345"
        serializer = CustomRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("phone_number", serializer.errors)

    def test_user_profile_serializer(self):
        user = User.objects.create_user(
            email="profile@example.com",
            password="pass123",
            username="profileuser",
            first_name="First",
            last_name="Last"
        )
        serializer = UserProfileSerializer(instance=user)
        self.assertEqual(serializer.data['full_name'], "First Last")
