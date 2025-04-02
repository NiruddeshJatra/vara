from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users.views import (
    CustomLoginView,
    ResendVerificationEmailView,
    VerifyEmailView,
    CustomRegisterView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    LogoutView,
)

# API URL patterns
api_patterns = [
    # User management
    path('users/', include('users.urls')),
    
    # Core functionality
    path('advertisements/', include('advertisements.urls')),
    path('rentals/', include('rentals.urls')),
    path('reviews/', include('reviews.urls')),
    
    # Additional features
    path('complaints/', include('complaints.urls')),
    path('messages/', include('messaging.urls')),
]

# Main URL patterns
urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Authentication endpoints
    path("auth/login/", CustomLoginView.as_view(), name="custom_login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/registration/", CustomRegisterView.as_view(), name="custom_register"),
    path(
        "auth/resend-verification/",
        ResendVerificationEmailView.as_view(),
        name="resend_verification",
    ),
    path(
        "auth/verify-email/<str:token>/",
        VerifyEmailView.as_view(),
        name="verify_email",
    ),
    
    # Password reset endpoints
    path(
        "auth/password/reset/",
        PasswordResetRequestView.as_view(),
        name="password_reset_request",
    ),
    path(
        "auth/password/reset/confirm/<str:uidb64>/<str:token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    
    # API endpoints
    path('api/', include(api_patterns)),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)