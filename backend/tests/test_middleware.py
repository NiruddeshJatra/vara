from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.sessions.models import Session
from django.utils.timezone import now, timedelta
from users.middleware import SessionManagementMiddleware

User = get_user_model()

class MiddlewareTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(email="mw@example.com", password="pass123", username="mwuser")

    def test_session_cleanup(self):
        request = self.factory.get('/')
        request.user = self.user
        # Attach session middleware
        session_mw = SessionMiddleware()
        session_mw.process_request(request)
        request.session.save()

        # Create additional sessions
        for i in range(10):
            Session.objects.create(
                session_key=f"dummy{i}",
                session_data="data",
                expire_date=now() + timedelta(days=1)
            )
        initial_count = Session.objects.count()

        # Run our custom middleware
        smm = SessionManagementMiddleware(lambda req: None)
        smm(request)
        final_count = Session.objects.count()
        self.assertLess(final_count, initial_count)
