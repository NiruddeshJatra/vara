# users/urls.py
from django.urls import path
from .views import CustomLoginView, VerifyEmailView, UserViewSet

router = DefaultRouter()
router.register(r'profiles', UserViewSet, basename='user-profiles')

urlpatterns = [
    # URL for custom login with additional verification.
    path('auth/login/', CustomLoginView.as_view(), name='custom_login'),
    # URL to verify email address.
    path('verify-email/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify_email'),
    path('', include(router.urls)),
]