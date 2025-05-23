"""
Production-specific settings.
"""

from .base import *
import os
from datetime import timedelta

DEBUG = False

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

CSRF_TRUSTED_ORIGINS = [
    "https://bhara.xyz",
    "https://*.bhara.xyz",
    "https://www.bhara.xyz",
    "https://api.bhara.xyz",
]
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# CORS settings for production with proper file handling
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "https://bhara.xyz",
    "https://www.bhara.xyz",
    "https://api.bhara.xyz"
]

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT"
]

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
    "x-http-method-override",
    "content-disposition",  # For file uploads
    "content-length",      # For large file uploads
    "cache-control",
    "pragma",
    "expires"
]

# Ensure cookies and credentials work properly
SESSION_COOKIE_DOMAIN = ".bhara.xyz"
CSRF_COOKIE_DOMAIN = ".bhara.xyz"
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# Cloudflare Specific Headers
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True
X_FRAME_OPTIONS = 'SAMEORIGIN'  # Allow Cloudflare iframe integration

# Additional security headers
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
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
    # Use custom MediaStorage for media files (user uploads)
    DEFAULT_FILE_STORAGE = 'bhara.storage_backends.MediaStorage'
    # Use S3Boto3Storage for static files only
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.environ.get('AWS_REGION', 'us-east-1')
    AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"
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
# Redis settings with proper connection pooling
REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')

# Cache settings with connection pooling
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "CONNECTION_POOL_KWARGS": {
                "max_connections": 30,
                "retry_on_timeout": True,
            },
            "SOCKET_CONNECT_TIMEOUT": 5,  # 5 seconds timeout for connections
            "SOCKET_TIMEOUT": 5,         # 5 seconds timeout for socket operations
        }
    }
}

# Celery settings using the same Redis URL
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
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

# Configure Channel Layers with Redis and connection pooling
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [REDIS_URL],
            "capacity": 1500,      # Maximum number of messages in memory
            "expiry": 10,          # Message expiration in seconds
            "channel_capacity": {
                # Default channel capacity (1000)  
                "http.request": 1000,
                # Per-channel overrides (different limits for different channels)
                "notification.*": 1000,
                "chat.*": 1000,
            },
        },
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