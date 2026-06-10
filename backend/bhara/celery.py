import os
import platform
from celery import Celery

# Use the DJANGO_SETTINGS_MODULE env var if set, otherwise default to development
os.environ.setdefault('DJANGO_SETTINGS_MODULE', os.environ.get('DJANGO_SETTINGS_MODULE', 'bhara.settings.development'))

app = Celery('bhara')
app.config_from_object('django.conf:settings', namespace='CELERY')

# Windows-specific settings
if platform.system() == 'Windows':
    # Use the 'solo' pool for Windows to avoid multiprocessing issues
    app.conf.worker_pool = 'solo'
    # Disable prefetching for better behavior with the solo pool
    app.conf.worker_prefetch_multiplier = 1
    # Disable rate limits
    app.conf.worker_disable_rate_limits = True

app.autodiscover_tasks()
