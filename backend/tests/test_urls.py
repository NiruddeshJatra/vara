from django.test import SimpleTestCase
from django.urls import reverse, resolve
from users.views import CustomLoginView, VerifyEmailView

class UrlsTest(SimpleTestCase):
    def test_custom_login_url(self):
        url = reverse('custom_login')
        resolver = resolve(url)
        self.assertEqual(resolver.func.cls, CustomLoginView)

    def test_verify_email_url(self):
        url = reverse('verify_email', kwargs={'uidb64': 'dummy', 'token': 'dummy'})
        resolver = resolve(url)
        self.assertEqual(resolver.func.cls, VerifyEmailView)
