import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, ChatMessage
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.chat_room_id = self.scope['url_route']['kwargs']['chat_room_id']
            self.room_group_name = f"chat_{self.chat_room_id}"

            if self.scope["user"] == AnonymousUser:
                await self.close()
                return

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        except Exception as e:
            await self.close(code=4000)
            print(f"WebSocket connection error: {e}")

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_id = self.scope["user"].id
        chat_room_id = self.chat_room_id

        # Save the message to the database
        chat_room = await sync_to_async(ChatRoom.objects.get)(id=chat_room_id)
        await sync_to_async(ChatMessage.objects.create)(
            chat_room=chat_room,
            sender_id=sender_id,
            content=message
        )

        # Broadcast the message to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': sender_id,
            }
        )

    async def chat_message(self, event):
        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
        }))
