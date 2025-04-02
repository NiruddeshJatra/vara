from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    UserProductViewSet,
    PricingOptionViewSet,
    ProductImageViewSet,
)


router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="products")
router.register(r"my-products", UserProductViewSet, basename="my-products")
router.register(r"pricing", PricingOptionViewSet, basename="pricing")
router.register(r"images", ProductImageViewSet, basename="images")

urlpatterns = [
    path("", include(router.urls)),
]
