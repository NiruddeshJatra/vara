from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_verification_email(user, request=None):
    """
    Send a verification email to the user
    
    In development, this will print to the console if EMAIL_BACKEND is set to 
    django.core.mail.backends.console.EmailBackend
    """
    verification_url = user.get_verification_url(request)
    
    # Render the HTML email template
    html_message = render_to_string('users/email/verify_email.html', {
        'username': user.username,
        'verification_url': verification_url,
        'frontend_url': settings.FRONTEND_URL,
    })
    
    # Create plain text version by stripping HTML
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject="Verify Your Email - Vara",
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )
    
    # For debugging in development
    print(f"Verification email sent to {user.email}")
    print(f"Verification URL: {verification_url}")