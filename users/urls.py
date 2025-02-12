from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomLoginView, UserViewSet


router = DefaultRouter()
router.register(r'profiles', UserViewSet, basename='user-profiles')

urlpatterns = [
    # URL for custom login with additional verification.
    path('auth/login/', CustomLoginView.as_view(), name='custom_login'),
    path('', include(router.urls)),
]