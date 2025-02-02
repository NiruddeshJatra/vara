from django.contrib.sessions.models import Session
from django.utils import timezone

class SessionManagementMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            Session.objects.filter(expire_date__lt=timezone.now()).delete()

            sessions = Session.objects.filter(
                expire_date__gte=timezone.now()
            ).order_by('-expire_date')[5:]
            
            for session in sessions:
                session.delete()

        return self.get_response(request)