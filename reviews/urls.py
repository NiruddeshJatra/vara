from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet
from .throttles import ReviewListThrottle  # imported throttle

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet, basename='review')  # Register ReviewViewSet endpoints

urlpatterns = [
    path('', include(router.urls)),  # Include router URLs
]