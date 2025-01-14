from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from .models import ChatMessage, ChatRoom
from .serializers import ChatMessageSerializer, ChatRoomSerializer


class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(Q(initiator=user) | Q(receiver=user)).distinct()

    def perform_create(self, serializer):
        if receiver := serializer.validated_data.get("receiver"):
            serializer.save(initiator=self.request.user)
        else:
            raise ValidationError("A receiver must be specified.")

    @action(detail=True, methods=["post"])
    def mark_as_read(self, request, pk=None):
        chat_room = self.get_object()
        messages_marked = ChatMessage.objects.filter(
            chat_room=chat_room,
            is_read=False,
        ).exclude(sender=request.user).update(is_read=True, read_at=timezone.now())
        return Response(
            {
                "status": "messages marked as read",
                "count": messages_marked,
            },
            status=status.HTTP_200_OK,
        )


class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        chat_room_id = self.request.query_params.get("chat_room")
        queryset = ChatMessage.objects.filter(
            chat_room__in=ChatRoom.objects.filter(
                Q(initiator=self.request.user) | Q(receiver=self.request.user)
            )
        )
        if chat_room_id:
            queryset = queryset.filter(chat_room_id=chat_room_id)
        return queryset

    def perform_create(self, serializer):
        chat_room = ChatRoom.objects.get(pk=self.request.data["chat_room"])
        if self.request.user not in [chat_room.initiator, chat_room.receiver]:
            raise PermissionError("You are not authorized to send messages in this chat room.")
        serializer.save(sender=self.request.user)
