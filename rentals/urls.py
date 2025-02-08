from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RentalViewSet
from rest_framework.throttling import UserRateThrottle

class RentalListThrottle(UserRateThrottle):
    # Throttle limit for rental requests.
    rate = '100/hour'

router = DefaultRouter()
# Register RentalViewSet to generate endpoints for rental operations.
router.register(r'rentals', RentalViewSet, basename='rental')

urlpatterns = [
    # Include all automatically generated rental URLs.
    path('', include(router.urls)),
]