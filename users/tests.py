# tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import CustomUser
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

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

    def test_valid_registration(self):
        response = self.client.post(self.register_url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = CustomUser.objects.get(email='test@example.com')
        self.assertFalse(user.is_verified)

    def test_duplicate_phone_number(self):
        # Create user with same phone number
        CustomUser.objects.create_user(
            email='existing@example.com', username='existing',
            phone_number='+8801712345678', password='testpass'
        )
        response = self.client.post(self.register_url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone_number', response.data)

class EmailVerificationTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email='test@example.com', username='testuser', password='testpass',
            is_verified=False
        )
        self.uid = urlsafe_base64_encode(force_bytes(str(self.user.pk)))
        self.token = default_token_generator.make_token(self.user)

    def test_valid_verification(self):
        url = reverse('verify_email', args=[self.uid, self.token])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_verified)

    def test_invalid_token(self):
        url = reverse('verify_email', args=[self.uid, 'invalidtoken'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UserProfileTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email='test@example.com', username='testuser', password='testpass',
            is_verified=True
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.profile_url = reverse('user-profiles-me')

    def test_retrieve_profile(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    def test_update_profile(self):
        update_data = {'first_name': 'Updated', 'last_name': 'Name'}
        response = self.client.patch(self.profile_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')

class AccountDeletionTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email='test@example.com', username='testuser', password='testpass',
            is_verified=True
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.delete_url = reverse('user-profiles-delete-account')

    def test_delete_account(self):
        data = {'password': 'testpass'}
        response = self.client.delete(self.delete_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)