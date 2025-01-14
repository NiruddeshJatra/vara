from django.db import models
from django.core.exceptions import ValidationError
from users.models import CustomUser
from advertisements.models import Product


class ChatRoom(models.Model):
    initiator = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="initiated_chats",
    )
    receiver = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="received_chats",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="chat_rooms",
    )
    is_active = models.BooleanField(default=True)
    last_message_timestamp = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("initiator", "receiver", "product")
        ordering = ["-last_message_timestamp", "-created_at"]

    def save(self, *args, **kwargs):
        if self.initiator == self.receiver:
            raise ValidationError("Cannot create a chat room with yourself.")
        super().save(*args, **kwargs)


class ChatMessage(models.Model):
    chat_room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    sender = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="sent_messages",
    )
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    attachment = models.FileField(
        upload_to="chat_attachments/", null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.chat_room.last_message_timestamp = self.created_at
        self.chat_room.save()
