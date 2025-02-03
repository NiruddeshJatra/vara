from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Review
from users.models import CustomUser

@receiver(post_save, sender=Review)
def update_user_rating(sender, instance, **kwargs):
    instance.user.update_average_rating()