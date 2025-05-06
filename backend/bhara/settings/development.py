"""
Development-specific settings.
"""

from .base import *
import os
from datetime import timedelta



# Disable environment variable reading for email settings
if hasattr(environ.Env, 'EMAIL_HOST'):
    del environ.Env.EMAIL_HOST

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# Development-specific apps
INSTALLED_APPS += [
    "debug_toolbar",
]

# Development-specific middleware
MIDDLEWARE += [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

# Database configuration
USE_SQLITE = True

if USE_SQLITE:
    print("Using SQLite database for development")
    # Using SQLite for development
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    print("Using PostgreSQL database for development")
    # PostgreSQL for dev that mimics production
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME', 'bhara_dev'),
            'USER': os.environ.get('DB_USER', 'postgres'),
            'PASSWORD': os.environ.get('DB_PASSWORD', ''),
            'HOST': os.environ.get('DB_HOST', 'localhost'),
            'PORT': os.environ.get('DB_PORT', '5432'),
        }
    }

# Allow all hosts in development
ALLOWED_HOSTS = ['*']

# Disable security features in development
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

# Temporarily disable CSRF protection for API testing
CSRF_TRUSTED_ORIGINS = ['http://localhost:5173', 'http://localhost:5174']
REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}

# JWT settings for development
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),  # 7 days for development
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),  # 30 days for development
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

# Session settings for development
SESSION_COOKIE_AGE = 30 * 24 * 60 * 60  # 30 days
SESSION_SAVE_EVERY_REQUEST = True
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

# Add LOGGING for development
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        'django.core.mail': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'dj_rest_auth': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'allauth': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

# CORS settings for development
CORS_ALLOW_ALL_ORIGINS = True  # Only for development
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Add additional CORS allowed headers
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
    "expires",
]

# Ensure cookies work properly in development
SESSION_COOKIE_SAMESITE = 'Lax'  
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_TRUSTED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

# File Upload Settings (match production)
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
MEDIA_FILE_UPLOAD_MAX_SIZE = 10485760  # 10MB

# Rest Framework settings
REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}