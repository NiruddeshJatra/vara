from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CheckNationalIdView

router = DefaultRouter()
router.register(r'profiles', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('profiles/check_national_id/', CheckNationalIdView.as_view(), name='check-national-id'),
]