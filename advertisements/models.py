from django.db import models
from users.models import CustomUser

# Create your models here.
class Product(models.Model):
  title = models.CharField(max_length=100)
  description = models.TextField()
  price = models.DecimalField(max_digits=2, decimal_places=2)
  image = models.ImageField()
  createdAt = models.DateTimeField(auto_now_add=True)
  user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)