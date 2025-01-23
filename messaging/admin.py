from django.contrib import admin
from .models import ChatRoom, ChatMessage

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ['id', 'initiator', 'receiver', 'product', 'is_active', 'last_message_timestamp']
    list_filter = ['is_active', 'last_message_timestamp']
    search_fields = ['initiator__username', 'receiver__username', 'product__title']
    actions = ['deactivate_chat_room']
    
    def deactivate_chat_rooms(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_chat_rooms.short_description = "Deactivate selected chat rooms"

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'chat_room', 'sender', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['content', 'sender__username']
    actions = ['mark_as_read']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True, read_at=timezone.now())
    mark_as_read.short_description = "Mark selected messages as read"