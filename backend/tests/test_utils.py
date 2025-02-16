from django.test import TestCase
from django.contrib.auth import get_user_model
from users.utils import email_verification_token

User = get_user_model()

class EmailVerificationTokenTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="testutils@example.com",
            password="pass123",
            username="utilsuser"
        )

    def test_token_generation_and_validation(self):
        token = email_verification_token.make_token(self.user)
        self.assertTrue(email_verification_token.check_token(self.user, token))
        
    def test_token_invalid_after_verification(self):
        token = email_verification_token.make_token(self.user)
        self.user.is_verified = True
        self.user.save()
        self.assertFalse(email_verification_token.check_token(self.user, token))
