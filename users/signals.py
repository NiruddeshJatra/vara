# Module: signals - Sends verification email once a new user is created.

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import CustomUser


@receiver(post_save, sender=CustomUser)
def send_verification_email(sender, instance, created, **kwargs):
    # Trigger email verification only for new unverified users.
    if created and not instance.is_verified:
        token = default_token_generator.make_token(instance)
        uid = urlsafe_base64_encode(force_bytes(instance.pk))

        subject = "Verify Your Email Address"
        message = render_to_string(
            "emails/verification_email.txt",
            {
                "user": user,
                "verification_url": verification_url,
            },
            using="users",
        )

        send_mail(
            subject,
            message,
            "noreply@yourdomain.com",  # Sender email address.
            [instance.email],
            fail_silently=False,
        )
