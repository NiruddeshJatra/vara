# tests.py
import unittest
from django.test import Client
from .models import CustomUser  # Use CustomUser instead of User
from django.contrib.auth.hashers import make_password

class UserTests(unittest.TestCase):
    def setUp(self):
        self.client = Client()
        self.user_data = {
            'username': 'testuser',
            'password': 'password123',
            'email': 'testuser@example.com',
            'phone_number': '01512345678',
            'first_name': 'Test',
            'last_name': 'User',
            'location': 'Dhaka'
        }
        # Ensure unique email for each test
        self.user_data['email'] = f"testuser{self.id()}@example.com"

    def test_registration_flow(self):
        response = self.client.post('/auth/registration/', self.user_data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(CustomUser.objects.filter(username='testuser').exists())

    def test_validate_phone_number(self):
        invalid_data = self.user_data.copy()
        invalid_data['phone_number'] = 'invalid_phone'
        response = self.client.post('/auth/registration/', invalid_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('phone_number', response.json().get('errors', {}))

    def test_validate_email(self):
        invalid_data = self.user_data.copy()
        invalid_data['email'] = 'invalid_email'
        response = self.client.post('/auth/registration/', invalid_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('email', response.json().get('errors', {}))

    def test_duplicate_registration(self):
        # First registration (success)
        self.client.post('/auth/registration/', self.user_data)
        # Second registration (fail)
        response = self.client.post('/auth/registration/', self.user_data)
        self.assertEqual(response.status_code, 400)

    def test_registration_to_login_flow(self):
        # Create and verify user
        user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password=make_password('password123'),
            is_verified=True  # Mark as verified
        )
        # Login
        response = self.client.post('/auth/login/', {
            'username': 'testuser',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)

    def test_user_profile_view(self):
        user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password123',
            is_verified=True
        )
        self.client.force_login(user)  # Simulate login
        response = self.client.get('/api/profiles/me/')
        self.assertEqual(response.status_code, 200)

    def test_user_profile_update(self):
        user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password123',
            is_verified=True
        )
        self.client.force_login(user)
        # Update allowed field (e.g., location)
        response = self.client.patch('/api/profiles/me/', {
            'location': 'New Dhaka'
        })
        self.assertEqual(response.status_code, 200)
        updated_user = CustomUser.objects.get(username='testuser')
        self.assertEqual(updated_user.location, 'New Dhaka')

    def test_user_profile_delete(self):
        user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password123',
            is_verified=True
        )
        self.client.force_login(user)
        response = self.client.delete('/api/profiles/delete-account/', {
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 204)
        user.refresh_from_db()
        self.assertFalse(user.is_active)  # Check soft delete

    def test_security(self):
        # Non-admin user accessing admin panel
        user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password123',
            is_verified=True
        )
        self.client.force_login(user)
        response = self.client.get('/admin/')
        self.assertEqual(response.status_code, 302)  # Redirect to login

    def test_integration(self):
        # Registration (already verified)
        user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password123',
            is_verified=True
        )
        self.client.force_login(user)
        # Profile view
        response = self.client.get('/api/profiles/me/')
        self.assertEqual(response.status_code, 200)
        # Profile update
        response = self.client.patch('/api/profiles/me/', {'location': 'Chittagong'})
        self.assertEqual(response.status_code, 200)
        # Account deletion
        response = self.client.delete('/api/profiles/delete-account/', {
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 204)

if __name__ == '__main__':
    unittest.main()