# notifications/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from rentals.models import Rental
from payments.models import Payment
from .models import Notification

@receiver(post_save, sender=Rental)
def notify_rental_status(sender, instance, created, **kwargs):
    if instance.status == "accepted":
        message = f"Your rental for {instance.product.title} has been accepted!"
        Notification.objects.create(user=instance.renter, message=message)
        send_mail(
            "Rental Accepted",
            message,
            settings.DEFAULT_FROM_EMAIL,
            [instance.renter.email]
        )

@receiver(post_save, sender=Payment)
def notify_payment_status(sender, instance, created, **kwargs):
    if instance.status == "COMPLETED":
        message = f"Payment of ৳{instance.amount} was successful."
        Notification.objects.create(user=instance.user, message=message)
        send_mail(
            "Payment Completed",
            message,
            settings.DEFAULT_FROM_EMAIL,
            [instance.user.email]
        )