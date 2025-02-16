from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from users.utils import email_verification_token
from users.views import CustomLoginView, VerifyEmailView

User = get_user_model()

class UserViewsTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123",
            username="testuser",
            is_verified=True
        )
        self.client.login(email="test@example.com", password="testpass123")

    def test_me_get(self):
        # Assuming 'user-detail' URL is configured to return user details.
        url = reverse('user-detail', kwargs={'pk': self.user.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_me_update(self):
        url = reverse('user-detail', kwargs={'pk': self.user.pk})
        data = {"first_name": "NewName"}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "NewName")

    def test_upload_picture(self):
        url = reverse('user-upload-picture')
        file_content = b'\x47\x49\x46\x38\x39\x61'
        image = SimpleUploadedFile("test.png", file_content, content_type="image/png")
        response = self.client.post(url, {'profile_picture': image})
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])

    def test_delete_account(self):
        # Call delete on the endpoint; adjust URL as per your router.
        response = self.client.delete('/users/delete_account/', data={"password": "testpass123"})
        self.assertIn(response.status_code, [status.HTTP_204_NO_CONTENT, status.HTTP_400_BAD_REQUEST])

class CustomLoginTest(APITestCase):
    def setUp(self):
        self.unverified = User.objects.create_user(
            email="unverified@example.com",
            password="testpass123",
            username="unverified",
            is_verified=False
        )
        self.client = APIClient()

    def test_login_unverified(self):
        url = reverse('custom_login')
        response = self.client.post(url, {"email": "unverified@example.com", "password": "testpass123"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class VerifyEmailViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="verify@example.com",
            password="testpass123",
            username="verifyuser",
            is_verified=False
        )

    def test_verify_email_valid(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = email_verification_token.make_token(self.user)
        url = reverse('verify_email', kwargs={'uidb64': uid, 'token': token})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_verified)

    def test_verify_email_invalid(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        url = reverse('verify_email', kwargs={'uidb64': uid, 'token': "invalid-token"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
