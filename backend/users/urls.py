from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CheckNationalIdView, PasswordResetRequestView, PasswordResetConfirmView

router = DefaultRouter()
router.register(r'profiles', UserViewSet, basename='user')

urlpatterns = [
    path('profiles/check_national_id/', CheckNationalIdView.as_view(), name='check-national-id'),
    path('', include(router.urls)),
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('auth/password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]