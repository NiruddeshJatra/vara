from rest_framework import serializers
from .models import ChatMessage, ChatRoom
from users.serializers import UserProfileSerializer


class ChatRoomSerializer(serializers.ModelSerializer):
    initiator_details = UserProfileSerializer(source="initiator", read_only=True)
    receiver_details = UserProfileSerializer(source="receiver", read_only=True)
    unread_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = "__all__"
        read_only_fields = ["initiator", "last_message_timestamp"]

    def get_unread_count(self, obj):
        user = self.context["request"].user
        return ChatMessage.objects.filter(
            chat_room=obj,
            is_read=False,
        ).exclude(sender=user).count()

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        return (
            {
                "content": last_msg.content[:50],
                "timestamp": last_msg.created_at,
                "sender_id": last_msg.sender_id,
            }
            if last_msg
            else None
        )


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.get_full_name", read_only=True)
    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = "__all__"
        read_only_fields = ["sender", "chat_room", "is_read", "read_at"]

    def get_attachment_url(self, obj):
        return (
            self.context["request"].build_absolute_uri(obj.attachment.url)
            if obj.attachment
            else None
        )
