from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Product, PricingOption, AvailabilityPeriod, ProductImage
from .serializers import (
    ProductSerializer,
    PricingOptionSerializer,
    AvailabilityPeriodSerializer,
    ProductImageSerializer,
)
from .filters import ProductFilter


class ProductViewSet(ReadOnlyModelViewSet):
    """
    Read-only endpoint for all users
    """

    queryset = Product.objects.select_related("owner", "pricing").filter(
        is_available=True
    )
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = ProductFilter
    search_fields = ["title", "category", "description", "location"]
    ordering_fields = ["pricing__base_price", "created_at", "average_rating"]
    ordering = ["-created_at"]

    @method_decorator(cache_page(60 * 15))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class UserProductViewSet(ModelViewSet):
    """
    Write operations for authenticated owners
    """

    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        if not self.request.user.is_verified:
            raise PermissionDenied("Verification required for product management")
        serializer.save(owner=self.request.user)
        
    # these two actions are needed because DRF doesn't create endpoint without viewsets and we are not creating a viewset for image. Ownership check is also needed.
    @action(detail=True, methods=["post"], url_path="add-image")
    def add_image(self, request, pk=None):
        product = self.get_object()
        serializer = ProductImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], url_path="delete-image/(?P<image_id>\d+)")
    def delete_image(self, request, pk=None, image_id=None):
        product = self.get_object()
        image = product.images.filter(id=image_id).first()
        if not image:
            return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PricingOptionViewSet(ModelViewSet):
    serializer_class = PricingOptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PricingOption.objects.filter(product__owner=self.request.user)


class AvailabilityPeriodViewSet(ModelViewSet):
    serializer_class = AvailabilityPeriodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AvailabilityPeriod.objects.filter(product__owner=self.request.user)
