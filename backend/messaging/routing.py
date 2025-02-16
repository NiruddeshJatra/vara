from django.urls import re_path
from . import consumers
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from .consumers import ChatConsumer

application = ProtocolTypeRouter({
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                re_path(r'ws/chat/(?P<chat_room_id>\d+)/$', ChatConsumer.as_asgi()),
            ])
        )
    ),
})

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<chat_room_id>\d+)/$', consumers.ChatConsumer.as_asgi()),
]
