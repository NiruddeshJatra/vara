# test_models.py
from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import CustomUser


class CustomUserTests(TestCase):
    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestPass123!",
            "phone_number": "+8801712345678",
            "location": "Dhaka, Bangladesh",
        }

    def test_create_user(self):
        user = CustomUser.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data["email"])
        self.assertTrue(user.check_password(self.user_data["password"]))

    def test_phone_number_validation(self):
        self.user_data["phone_number"] = "invalid"
        with self.assertRaises(ValidationError):
            user = CustomUser.objects.create_user(**self.user_data)
            user.full_clean()


# test_auth.py
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.register_url = reverse("rest_register")
        self.login_url = reverse("rest_login")
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password1": "TestPass123!",
            "password2": "TestPass123!",
            "phone_number": "+8801712345678",
            "location": "Dhaka, Bangladesh",
        }

    def test_registration(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            CustomUser.objects.filter(email=self.user_data["email"]).exists()
        )

    def test_email_verification(self):
        # Register user
        self.client.post(self.register_url, self.user_data)
        user = CustomUser.objects.get(email=self.user_data["email"])

        # Simulate email verification
        from allauth.account.models import EmailConfirmation

        confirmation = EmailConfirmation.create(user.emailaddress_set.first())
        confirmation.sent = timezone.now()
        confirmation.save()

        # Verify email
        response = self.client.post(
            reverse("rest_verify_email"), {"key": confirmation.key}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.is_verified)


# test_profile.py
class UserProfileTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser", email="test@example.com", password="TestPass123!"
        )
        self.client.force_authenticate(user=self.user)

    def test_profile_update(self):
        url = reverse("user-detail", kwargs={"pk": self.user.pk})
        data = {"first_name": "Test", "last_name": "User", "bio": "Test bio"}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "Test")

    def test_profile_picture_upload(self):
        url = reverse("user-upload-picture")
        with open("test_image.jpg", "rb") as img:
            response = self.client.post(
                url, {"profile_picture": img}, format="multipart"
            )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["profile_picture"])


# test_integration.py
class IntegrationTests(APITestCase):
    def test_full_auth_flow(self):
        # 1. Register
        register_response = self.client.post(
            reverse("rest_register"),
            {
                "username": "testuser",
                "email": "test@example.com",
                "password1": "TestPass123!",
                "password2": "TestPass123!",
                "phone_number": "+8801712345678",
                "location": "Dhaka, Bangladesh",
            },
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        # 2. Verify Email
        user = CustomUser.objects.get(email="test@example.com")
        confirmation = EmailConfirmation.create(user.emailaddress_set.first())
        confirmation.sent = timezone.now()
        confirmation.save()
        verify_response = self.client.post(
            reverse("rest_verify_email"), {"key": confirmation.key}
        )
        self.assertEqual(verify_response.status_code, status.HTTP_200_OK)

        # 3. Login
        login_response = self.client.post(
            reverse("rest_login"),
            {"email": "test@example.com", "password": "TestPass123!"},
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("key", login_response.data)

        # 4. Update Profile
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Token {login_response.data["key"]}'
        )
        profile_response = self.client.patch(
            reverse("user-me"), {"first_name": "Test", "last_name": "User"}
        )
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
