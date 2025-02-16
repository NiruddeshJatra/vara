from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Review
from users.models import CustomUser

# Signal handler to update entity ratings when a review is deleted.
@receiver(post_delete, sender=Review)
def update_rating_on_delete(sender, instance, **kwargs):
    # Update the target entity based on review type on deletion.
    if instance.review_type == 'property':
        instance.rental.product.update_average_rating()  # Update product rating
    elif instance.review_type == 'user' and instance.reviewed_user:
        instance.reviewed_user.update_average_rating()  # Update user rating
        
@receiver([post_save, post_delete], sender=Review)
def update_ratings(sender, instance, **kwargs):
    if instance.review_type == "property":
        instance.rental.product.update_average_rating()
    elif instance.review_type == "user" and instance.reviewed_user:
        instance.reviewed_user.update_average_rating()