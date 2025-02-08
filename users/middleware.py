# Module: middleware - Manages old session cleanup for authenticated users.

from django.contrib.sessions.models import Session
from django.utils import timezone

class SessionManagementMiddleware:
    # Middleware to delete expired sessions and limit active sessions.
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Proceed only for authenticated users.
        if request.user.is_authenticated:
            # Delete sessions that are expired.
            Session.objects.filter(expire_date__lt=timezone.now()).delete()
            # Keep only the five most recent active sessions.
            sessions = Session.objects.filter(
                expire_date__gte=timezone.now()
            ).order_by('-expire_date')[5:]
            
            for session in sessions:
                session.delete()

        return self.get_response(request)