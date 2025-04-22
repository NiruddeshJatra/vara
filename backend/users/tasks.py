from celery import shared_task
from django.contrib.auth import get_user_model
from users.email_service import send_verification_email
from django.utils import timezone
from datetime import timedelta

@shared_task
def send_verification_email_task(user_id, request_meta=None):
    User = get_user_model()
    user = User.objects.get(id=user_id)
    send_verification_email(user, request_meta)

@shared_task
def delete_unverified_users():
    """
    Delete users who have not verified their email within 12 hours of registration.
    """
    User = get_user_model()
    twelve_hours_ago = timezone.now() - timedelta(hours=12)
    unverified_users = User.objects.filter(
        is_email_verified=False,
        created_at__lt=twelve_hours_ago
    )
    count = unverified_users.count()
    unverified_users.delete()
    return f"Deleted {count} unverified users."
