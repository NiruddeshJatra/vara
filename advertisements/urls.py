from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet


router = DefaultRouter()
router.register(r'advertisements', ProductViewSet, basename='advertisements')


urlpatterns = [
    path('api/', include(router.urls)),
]
