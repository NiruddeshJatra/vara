"""
Development-specific settings.
"""

from .base import *

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

# REST_FRAMEWORK = {
#     'DEFAULT_THROTTLE_CLASSES': [],
#     'DEFAULT_THROTTLE_RATES': {},
# }