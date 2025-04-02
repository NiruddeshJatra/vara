from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework import filters, status
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from .models import Product, PricingOption, ProductImage
from .serializers import (
    ProductSerializer,
    PricingOptionSerializer,
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

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        product = self.get_object()
        product.increment_views()
        return Response({'status': 'views incremented'})

    @action(detail=True, methods=['post'])
    def update_rating(self, request, pk=None):
        product = self.get_object()
        new_rating = request.data.get('rating')
        if new_rating is not None:
            product.update_average_rating(float(new_rating))
            return Response({'status': 'rating updated'})
        return Response({'error': 'rating not provided'}, status=status.HTTP_400_BAD_REQUEST)


class UserProductViewSet(ModelViewSet):
    """
    CRUD endpoint for authenticated users' own products
    """

    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ["title", "category", "description", "location"]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.owner != self.request.user:
            raise PermissionDenied("You can only update your own products")
        serializer.save()


class PricingOptionViewSet(ModelViewSet):
    serializer_class = PricingOptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PricingOption.objects.filter(product__owner=self.request.user)


class ProductImageViewSet(ModelViewSet):
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProductImage.objects.filter(product__owner=self.request.user)
