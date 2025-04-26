from celery import shared_task
from django.contrib.auth import get_user_model
from users.email_service import send_verification_email, send_password_reset_email
from django.utils import timezone
from datetime import timedelta
import logging
logger = logging.getLogger("celery.unverified_cleanup")

@shared_task
def send_verification_email_task(user_id, request_meta=None):
    print(f"Celery: Preparing to send verification email for user_id={user_id}")
    User = get_user_model()
    user = User.objects.get(id=user_id)
    send_verification_email(user, request_meta)

@shared_task
def send_password_reset_email_task(user_id, reset_url, request_meta=None):
    User = get_user_model()
    user = User.objects.get(id=user_id)
    send_password_reset_email(user, reset_url, request_meta)

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
    logger.info(f"Found {count} unverified users to delete (created before {twelve_hours_ago})")
    if count > 0:
        logger.debug(f"User IDs to be deleted: {list(unverified_users.values_list('id', flat=True))}")
    deleted, _ = unverified_users.delete()
    logger.info(f"Deleted {deleted} unverified users.")
    return f"Deleted {deleted} unverified users."
