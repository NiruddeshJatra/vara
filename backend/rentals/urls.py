from django.urls import path, include
from rest_framework import routers
from .views import RentalViewSet, RentalPhotoViewSet

router = routers.DefaultRouter()
router.register(r'rentals', RentalViewSet, basename='rental')

rentals_router = routers.SimpleRouter()  # Changed from NestedSimpleRouter to SimpleRouter
rentals_router.register(r'photos', RentalPhotoViewSet, basename='rental-photos')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(rentals_router.urls)),
]