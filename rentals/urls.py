from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RentalViewSet
from rest_framework.throttling import UserRateThrottle

class RentalListThrottle(UserRateThrottle):
    rate = '100/hour'

router = DefaultRouter()
router.register(r'rentals', RentalViewSet, basename='rental')

urlpatterns = [
    path('', include(router.urls)),
]