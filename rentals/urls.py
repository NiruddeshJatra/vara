from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RentalRequestViewSet

router = DefaultRouter()
router.register(r'rentals', RentalRequestViewSet, basename='rentals')

urlpatterns = [
    path('rentals/', include(router.urls)),
]
