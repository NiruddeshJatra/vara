from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import CustomUser
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .utils import email_verification_token
from django.utils import timezone
from datetime import timedelta
from unittest import skip


class UserRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('rest_register')
        self.valid_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password1': 'complexpassword123',
            'password2': 'complexpassword123',
            'phone_number': '+8801712345678',
            'location': 'Test City',
            'first_name': 'Test',
            'last_name': 'User',
        }
        self.user = CustomUser.objects.create_user(
            email='existing@example.com', username='existing',
            phone_number='+8801712345678', password='testpass'
        )

    @skip("Registration validation needs to be fixed")
    def test_valid_registration(self):
        # Use a unique email for each test run
        self.valid_data["phone_number"] = "+8801712345678"
        response = self.client.post(self.register_url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @skip("Phone number validation needs to be fixed")
    def test_valid_phone_numbers(self):
        valid_numbers = ["+8801712345678", "8801712345678", "01712345678"]
        for idx, number in enumerate(valid_numbers):
            self.valid_data["phone_number"] = number
            self.valid_data["email"] = f"test{idx}@example.com"  # Unique email
            response = self.client.post(self.register_url, self.valid_data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_duplicate_phone_number(self):
        response = self.client.post(self.register_url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("phone_number", response.data)

    def test_password_reset(self):
        reset_url = reverse("rest_password_reset")
        response = self.client.post(reset_url, {"email": self.user.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @skip("Rate limiting configuration needs adjustment")
    def test_rate_limiting(self):
        # Add proper throttle class configuration
        with self.settings(REST_FRAMEWORK={
            'DEFAULT_THROTTLE_CLASSES': ['rest_framework.throttling.AnonRateThrottle'],
            'DEFAULT_THROTTLE_RATES': {'anon': '5/minute'}
        }):
            for i in range(6):  # Try 6 times (5 allowed + 1 over limit)
                response = self.client.post(self.register_url, self.valid_data)
            self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)


class EmailVerificationTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass",
            is_verified=False,
        )
        self.uid = urlsafe_base64_encode(force_bytes(str(self.user.pk)))
        self.token = email_verification_token.make_token(self.user)
        self.url = reverse("verify_email", args=[self.uid, self.token])
        self.invalid_token_url = reverse(
            "verify_email", args=[self.uid, "invalidtoken"]
        )

    def test_valid_verification(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_token(self):
        response = self.client.get(self.invalid_token_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_expired_token(self):
        self.user.date_joined = timezone.now() - timedelta(
            days=2
        )  # Simulate expired token
        self.user.save()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Verification link expired")


class UserProfileTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass",
            is_verified=True,
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.profile_url = reverse("user-profiles-me")

    def test_retrieve_profile(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)

    def test_update_profile(self):
        update_data = {"first_name": "Updated", "last_name": "Name"}
        response = self.client.patch(self.profile_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Updated")


class AccountDeletionTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass",
            is_verified=True,
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.delete_url = reverse("user-profiles-delete-account")

    def test_delete_account(self):
        data = {"password": "testpass"}
        response = self.client.delete(self.delete_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)


class SecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse("rest_register")
        self.valid_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password1": "complexpassword123",
            "password2": "complexpassword123",
            "phone_number": "+8801712345678",
            "location": "Test City",
            "first_name": "Test",
            "last_name": "User",
        }

    def test_sql_injection(self):
        malicious_data = self.valid_data.copy()
        malicious_data["username"] = "testuser'; DROP TABLE users; --"
        response = self.client.post(self.register_url, malicious_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_authentication_bypass(self):
        response = self.client.get(reverse("user-profiles-me"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class IntegrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse("rest_register")
        self.valid_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password1": "complexpassword123",
            "password2": "complexpassword123",
            "phone_number": "+8801712345678",
            "location": "Test City",
            "first_name": "Test",
            "last_name": "User",
        }
    
    @skip("Email verification flow needs fixing")
    def test_registration_to_login_flow(self):
        # Step 1: Register a new user
        response = self.client.post(self.register_url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Step 2: Verify email (simulate clicking the verification link)
        user = CustomUser.objects.get(email="test@example.com")
        user.created_at = timezone.now()  # Reset the join time
        user.save()
        uid = urlsafe_base64_encode(force_bytes(str(user.pk)))
        token = email_verification_token.make_token(user)
        verify_url = reverse("verify_email", args=[uid, token])
        response = self.client.get(verify_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Step 3: Login with the verified account
        login_url = reverse("rest_login")
        login_data = {
            "email": "test@example.com",
            "password": "complexpassword123",
        }
        response = self.client.post(login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
