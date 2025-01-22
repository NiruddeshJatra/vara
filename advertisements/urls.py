# advertisements/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductReadOnlyViewSet,
    ProductWriteViewSet,
    PricingOptionViewSet,
    AvailabilityPeriodViewSet
)

router = DefaultRouter()
router.register(r'products', ProductReadOnlyViewSet, basename='products')
router.register(r'my-products', ProductWriteViewSet, basename='my-products')
router.register(r'pricing', PricingOptionViewSet, basename='pricing')
router.register(r'availability', AvailabilityPeriodViewSet, basename='availability')

urlpatterns = [
    path('', include(router.urls)),
]