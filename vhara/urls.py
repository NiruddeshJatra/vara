"""
URL configuration for vhara project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView

# API URL patterns
api_patterns = [
    # User management
    path('users/', include('users.urls')),
    
    # Core functionality
    path('rentals/', include('rentals.urls')),
    path('reviews/', include('reviews.urls')),
    
    # Additional features
    path('complaints/', include('complaints.urls')),
    path('messages/', include('messaging.urls')),
    path('payments/', include('payments.urls')),
]

# Main URL patterns
urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Authentication
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('auth/password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    # API endpoints
    path('api/', include(api_patterns)),
    
    # Optional: Default advertisement routes at root level
    path('', include('advertisements.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)