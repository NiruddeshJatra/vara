from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet
from rest_framework.throttling import UserRateThrottle

class ReviewListThrottle(UserRateThrottle):
    rate = '100/hour'
    
    
router = DefaultRouter()
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]