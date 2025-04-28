"""
Production-specific settings.
"""

from .base import *
import os
from datetime import timedelta
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")

# Security settings
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

CSRF_TRUSTED_ORIGINS = [
    "https://bhara.xyz",
    "https://www.bhara.xyz",
    "https://api.bhara.xyz",
]
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# CORS settings for production
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "https://bhara.xyz",
    "https://www.bhara.xyz",
    "https://api.bhara.xyz",
]
CORS_ALLOW_METHODS = ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# Database configuration
DATABASES = {
    'default': dj_database_url.config(
        default=f"postgresql://{os.environ.get('DB_USER')}:{os.environ.get('DB_PASSWORD')}@{os.environ.get('DB_HOST')}:{os.environ.get('DB_PORT')}/{os.environ.get('DB_NAME')}",
        conn_max_age=600
    )
}

# --- STATIC & MEDIA (RENDER COMPATIBILITY) ---
# Use S3 for static and media files if AWS env vars are set, else fallback to local (for easier local/CI testing)
USE_S3 = all([
    os.environ.get('AWS_ACCESS_KEY_ID'),
    os.environ.get('AWS_SECRET_ACCESS_KEY'),
    os.environ.get('AWS_STORAGE_BUCKET_NAME'),
    os.environ.get('CLOUDFRONT_DOMAIN'),
])

if USE_S3:
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.environ.get('AWS_REGION', 'us-east-1')
    AWS_S3_CUSTOM_DOMAIN = os.environ.get('CLOUDFRONT_DOMAIN')
    AWS_LOCATION = 'static'
    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
else:
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
    STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
    STATIC_URL = '/static/'
    MEDIA_URL = '/media/'
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# --- Environment Variable Checks (diagnostic) ---
for var in [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_STORAGE_BUCKET_NAME",
    "AWS_REGION",
    "CLOUDFRONT_DOMAIN"
]:
    if not os.environ.get(var):
        print(f"WARNING: Environment variable {var} is NOT SET!", flush=True)
    else:
        print(f"{var} is set to: {os.environ.get(var)}", flush=True)

# Email settings for production
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.your_email_provider.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', 'no-reply@bhara.com')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'no-reply@bhara.com')

# Celery settings
CELERY_BROKER_URL = os.environ.get('REDIS_URL', os.environ.get('CELERY_BROKER_URL'))
CELERY_RESULT_BACKEND = os.environ.get('REDIS_URL', os.environ.get('CELERY_RESULT_BACKEND'))
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

# Celery Beat Schedule: Delete unverified users every hour
CELERY_BEAT_SCHEDULE = {
    "delete_unverified_users": {
        "task": "users.tasks.delete_unverified_users",
        "schedule": timedelta(hours=1),  # runs every hour
    },
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/tmp/production.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
        'bhara': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

import sys
LOGGING['handlers']['console'] = {
    'level': 'DEBUG',
    'class': 'logging.StreamHandler',
    'stream': sys.stdout,
}
LOGGING['loggers']['django']['handlers'].append('console')
print("PRODUCTION SETTINGS LOADED: DEFAULT_FILE_STORAGE =", DEFAULT_FILE_STORAGE)

# --- Force Django to use the correct storage backend at runtime (workaround for early import issues) ---
from django.core.files.storage import default_storage
from django.utils.module_loading import import_string
try:
    default_storage._wrapped = import_string(DEFAULT_FILE_STORAGE)()
    print("FORCED DEFAULT_FILE_STORAGE:", default_storage.__class__, flush=True)
except Exception as e:
    print(f"ERROR forcing DEFAULT_FILE_STORAGE: {e}", flush=True)