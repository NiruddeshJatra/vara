# users/tests.py
from django.test import TestCase, override_settings
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.utils import timezone
from allauth.account.models import EmailConfirmation
from unittest.mock import patch
from .models import CustomUser


# Model Tests
class CustomUserTests(TestCase):
    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestPass123!",
            "phone_number": "+8801712345678",
            "location": "Dhaka, Bangladesh",
        }

    @patch("users.signals.send_verification_email")
    def test_create_user(self, mock_signal):
        user = CustomUser.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data["email"])
        self.assertTrue(user.check_password(self.user_data["password"]))

    @patch('users.signals.send_verification_email')
    def test_phone_number_validation(self, mock_signal):
        self.user_data["phone_number"] = "invalid"
        with self.assertRaises(ValidationError):
            user = CustomUser.objects.create_user(**self.user_data)
            user.full_clean()


# Authentication Tests
@override_settings(ACCOUNT_EMAIL_VERIFICATION="none")
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
        response = self.client.post(self.register_url, self.user_data)
        user = CustomUser.objects.get(email=self.user_data["email"])
        confirmation = EmailConfirmation.create(user.emailaddress_set.first())
        response = self.client.post(
            reverse("rest_verify_email"), {"key": confirmation.key}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)


# Integration Tests
@override_settings(ACCOUNT_EMAIL_VERIFICATION="none")
class IntegrationTests(APITestCase):
    def test_full_auth_flow(self):
        # Registration
        response = self.client.post(
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
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Login
        login_response = self.client.post(
            reverse("rest_login"),
            {"email": "test@example.com", "password": "TestPass123!"},
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)


# Profile Tests
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

    def test_profile_picture_upload(self):
        url = reverse("user-upload-picture")
        with open("users/tests/test_image.jpeg", "rb") as img:
            response = self.client.post(
                url, {"profile_picture": img}, format="multipart"
            )
        self.assertEqual(response.status_code, status.HTTP_200_OK)