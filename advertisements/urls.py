from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductReadOnlyViewSet, ProductWriteViewSet, PricingOptionViewSet, AvailabilityPeriodViewSet

router = DefaultRouter()
router.register(r'advertisements', ProductReadOnlyViewSet, basename='advertisements-read')
router.register(r'my-advertisements', ProductWriteViewSet, basename='advertisements-write')
router.register(r'pricing-options', PricingOptionViewSet, basename='pricing-options')
router.register(r'availability-periods', AvailabilityPeriodViewSet, basename='availability-periods')

urlpatterns = [
    path('api/', include(router.urls)),
]
