from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    UserProductViewSet,
    PricingOptionViewSet,
    AvailabilityPeriodViewSet,
)


router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="products")
router.register(r"my-products", UserProductViewSet, basename="my-products")
router.register(r"pricing", PricingOptionViewSet, basename="pricing")
router.register(r"availability", AvailabilityPeriodViewSet, basename="availability")

urlpatterns = [
    path("", include(router.urls)),
]
