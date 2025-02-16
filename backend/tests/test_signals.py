from django.test import TestCase, override_settings
from django.core import mail
from django.contrib.auth import get_user_model

User = get_user_model()

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class SignalsTest(TestCase):
    def test_send_verification_email(self):
        mail.outbox = []
        User.objects.create_user(
            email="signal@example.com",
            password="pass123",
            username="signaluser",
            is_verified=False
        )
        self.assertTrue(len(mail.outbox) > 0)
        self.assertIn("Verify Your Email Address", mail.outbox[0].subject)
