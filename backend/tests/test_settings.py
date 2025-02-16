from django.conf import settings
from django.test import SimpleTestCase

class SettingsTest(SimpleTestCase):
    def test_secret_key(self):
        self.assertTrue(hasattr(settings, 'SECRET_KEY'))
        self.assertIsNotNone(settings.SECRET_KEY)

    def test_installed_apps(self):
        self.assertIn('django.contrib.admin', settings.INSTALLED_APPS)

    def test_cache_backend(self):
        self.assertIn('default', settings.CACHES)
        self.assertEqual(settings.CACHES['default']['BACKEND'], 'django.core.cache.backends.dummy.DummyCache')
