# messaging/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatMessageViewSet, ChatRoomViewSet
from rest_framework.throttling import UserRateThrottle

class ChatRoomListThrottle(UserRateThrottle):
    rate = '100/hour'

router = DefaultRouter()
router.register(r'rooms', ChatRoomViewSet, basename='chat-room')
router.register(r'messages', ChatMessageViewSet, basename='chat-message')

urlpatterns = [
    path('', include(router.urls)),
]