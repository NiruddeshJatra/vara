from django.urls import path, include
from rest_framework import routers
from .views import RentalViewSet, RentalPhotoViewSet

# Main router for rentals
router = routers.DefaultRouter()
router.register(r'', RentalViewSet, basename='rental')

# Router for rental photos
photos_router = routers.SimpleRouter()
photos_router.register(r'photos', RentalPhotoViewSet, basename='rental-photos')

urlpatterns = [
    # Main rental endpoints
    path('', include(router.urls)),
    
    # Rental photos endpoints
    path('rentals/<int:rental_pk>/', include(photos_router.urls)),
    
    # Custom endpoints
    path('rentals/my-rentals/', RentalViewSet.as_view({'get': 'my_rentals'}), name='my-rentals'),
    path('rentals/my-listings-rentals/', RentalViewSet.as_view({'get': 'my_listings_rentals'}), name='my-listings-rentals'),
    
    # Status change endpoints
    path('rentals/<int:pk>/accept/', RentalViewSet.as_view({'post': 'accept'}), name='rental-accept'),
    path('rentals/<int:pk>/reject/', RentalViewSet.as_view({'post': 'reject'}), name='rental-reject'),
    path('rentals/<int:pk>/cancel/', RentalViewSet.as_view({'post': 'cancel'}), name='rental-cancel'),
]