from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplaintViewSet
from rest_framework.throttling import UserRateThrottle

class ComplaintListThrottle(UserRateThrottle):
    rate = '100/hour'

router = DefaultRouter()
router.register(r'complaints', ComplaintViewSet, basename='complaint')

urlpatterns = [
    path('', include(router.urls)),
]