from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

User = get_user_model()

@receiver(post_save, sender=User)
def send_verification_email(sender, instance, created, **kwargs):
    if created and not instance.is_email_verified:
        # Generate a unique verification token
        token = str(instance.id) + '_' + str(instance.email)
        
        # Prepare the email
        subject = 'Verify Your Email Address'
        
        # Render HTML and plain text versions
        html_message = render_to_string('email_verification.html', {
            'user': instance,
            'token': token,
            'domain': settings.SITE_DOMAIN
        })
        
        plain_message = strip_tags(html_message)
        
        # Send the email
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
            html_message=html_message,
            fail_silently=False,
        )
