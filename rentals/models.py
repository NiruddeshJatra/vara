from django.db import models
from users.models import CustomUser
from advertisements.models import Product


# Create your models here.
class Rentals(models.Model):
    CHOICES = [
      ('pending', 'Pending'),
      ('accepted', 'Accepted'),
      ('rejected', 'Rejected')
    ]
    renter = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    start_time = models.DateTimeField(help_text='when renting period starts')
    end_time = models.DateTimeField(help_text='when renting period ends')
    status = models.CharField(max_length=50, choices=CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)