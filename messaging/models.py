from django.db import models
from users.models import CustomUser
from advertisements.models import Product


# Create your models here.
class ChatRoom(models.Model):
    initiator = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    reciever = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
class ChatMessage(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    room = models.CharField(max_length=100)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now=True)