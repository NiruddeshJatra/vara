from celery import shared_task
from django.contrib.auth import get_user_model
from users.email_service import send_verification_email

@shared_task
def send_verification_email_task(user_id, request_meta=None):
    User = get_user_model()
    user = User.objects.get(id=user_id)
    send_verification_email(user, request_meta)
