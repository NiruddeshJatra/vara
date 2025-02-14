from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from rentals.models import Rental
from .models import Notification


@receiver(post_save, sender=Rental)
def notify_rental_status(sender, instance, **kwargs):
    status_messages = {
        "accepted": ("Rental Accepted", "has been accepted"),
        "rejected": ("Rental Rejected", "has been rejected"),
        "cancelled": ("Rental Cancelled", "has been cancelled"),
        "completed": ("Rental Completed", "has been completed"),
        "in_progress": ("Rental Started", "has started")
    }

    if instance.status in status_messages:
        subject, verb = status_messages[instance.status]
        recipients = [instance.renter]
        
        if instance.status == "cancelled":
            recipients = [instance.owner, instance.renter]
            
        for user in recipients:
            message = f"Rental #{instance.id} for {instance.product.title} {verb}"
            Notification.objects.create(user=user, message=message)
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True
            )
        
        
# @receiver(post_save, sender=Payment)
# def notify_payment_status(sender, instance, created, **kwargs):
#     if instance.status == "COMPLETED":
#         message = f"Payment of ৳{instance.amount} was successful."
#         Notification.objects.create(user=instance.user, message=message)
#         send_mail(
#             "Payment Completed",
#             message,
#             settings.DEFAULT_FROM_EMAIL,
#             [instance.user.email]
# )