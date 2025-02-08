# Module: urls - Registers URLs for user authentication and email verification.

from django.urls import path
from .views import CustomLoginView, VerifyEmailView
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView

urlpatterns = [
    # URL for custom login with additional verification.
    path('auth/login/', CustomLoginView.as_view(), name='custom_login'),
    # URL to initiate password reset.
    path('password/reset/', PasswordResetView.as_view(), name='password_reset'),
    # URL to confirm a password reset using uid and token.
    path('password/reset/confirm/<uidb64>/<token>/', 
        PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    # URL to verify email address.
    path('verify-email/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify_email'),
]
