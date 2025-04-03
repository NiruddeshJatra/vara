from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    UserProductViewSet,
    ProductImageViewSet,
    PricingTierViewSet,
)


router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")
router.register(r"my-products", UserProductViewSet, basename="my-products")
router.register(r"products/(?P<product_pk>\d+)/images", ProductImageViewSet, basename="product-image")
router.register(r"products/(?P<product_pk>\d+)/pricing-tiers", PricingTierViewSet, basename="pricing-tier")


urlpatterns = [
    path("", include(router.urls)),
]
