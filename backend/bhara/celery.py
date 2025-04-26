import os
from celery import Celery

# Use the DJANGO_SETTINGS_MODULE env var if set, otherwise default to production
os.environ.setdefault('DJANGO_SETTINGS_MODULE', os.environ.get('DJANGO_SETTINGS_MODULE', 'bhara.settings.development'))

app = Celery('bhara')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
