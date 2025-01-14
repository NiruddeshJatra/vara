from django.contrib.sessions.models import Session
from django.utils import timezone

class SessionManagementMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            # Delete expired sessions
            Session.objects.filter(expire_date__lt=timezone.now()).delete()

            # Limit active sessions per user (optional)
            sessions = Session.objects.filter(
                expire_date__gte=timezone.now()
            ).order_by('-expire_date')[5:]  # Keep only 5 most recent sessions
            for session in sessions:
                session.delete()

        return self.get_response(request)