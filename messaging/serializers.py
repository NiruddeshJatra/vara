from rest_framework import serializers
from .models import ChatMessage, ChatRoom


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
      model = ChatRoom
      fields = ['initiator', 'reciever', 'created_at']
      read_only_fields = ['initiator', 'reciever', 'created_at']
      
      
class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
      model = ChatMessage
      fields = ['sender', 'room', 'content', 'timestamp']
      read_only_fields = ['sender', 'room', 'timestamp']