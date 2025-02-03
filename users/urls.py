from django.urls import path
from .views import CustomLoginView, VerifyEmailView
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView


urlpatterns = [
    path('auth/login/', CustomLoginView.as_view(), name='custom_login'),
    path('password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password/reset/confirm/<uidb64>/<token>/', 
        PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('verify-email/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify_email'),
]
