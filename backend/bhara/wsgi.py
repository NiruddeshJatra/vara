"""
WSGI config for bhara project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""
print("WSGI loaded, starting Django application...", flush=True)
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bhara.settings.production")

application = get_wsgi_application()
print("WSGI application loaded, starting Django application...", flush=True)
