from django.urls import path
from .views import SendOTPView, VerifyOTPView, CheckPhoneVerificationView

app_name = 'otp_auth'

urlpatterns = [
    path('send/', SendOTPView.as_view(), name='send-otp'),
    path('verify/', VerifyOTPView.as_view(), name='verify-otp'),
    path('check/', CheckPhoneVerificationView.as_view(), name='check-verification'),
]
