from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import CustomUser
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .utils import email_verification_token


@receiver(post_save, sender=CustomUser)
def send_verification_email(sender, instance, created, **kwargs):
    # Trigger email verification only for new unverified users.
    if created and not instance.is_verified:
        token = email_verification_token.make_token(instance)
        uid = urlsafe_base64_encode(force_bytes(str(instance.pk)))
        verification_url = f"http://yourdomain.com/verify-email/{uid}/{token}/"  # Construct the verification URL

        subject = "Verify Your Email Address"
        message = render_to_string(
            "emails/verification_email.txt",  # Path to your email template
            {
                "user": instance,
                "verification_url": verification_url,
            }
        )

        send_mail(
            subject,
            message,
            "noreply@yourdomain.com",  # Sender email address.
            [instance.email],
            fail_silently=False,
        )