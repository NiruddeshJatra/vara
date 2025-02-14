from django.urls import path, include
from rest_framework_nested import routers

router = routers.DefaultRouter()
router.register(r'rentals', RentalViewSet)

rentals_router = routers.NestedSimpleRouter(router, r'rentals', lookup='rental')
rentals_router.register(r'photos', RentalPhotoViewSet, basename='rental-photos')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(rentals_router.urls)),
]