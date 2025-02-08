# This file contains viewsets for product read-only endpoints, write endpoints,
# and additional actions related to advertisements.

from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from django.conf import settings
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.db.models import F, Prefetch
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from django.core.cache import cache
from .serializers import (
    ProductSerializer,
    PricingOptionSerializer,
    AvailabilityPeriodSerializer,
)
from .filters import ProductFilter
from .models import Product, AvailabilityPeriod, PricingOption


# Base viewset providing common methods and permission settings for products.
class BaseProductViewSet:
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    # Returns the base queryset for a product, optimizing select_related and prefetch_related
    def get_base_queryset(self):
        return (
            Product.objects.select_related("user", "pricing")
            .prefetch_related(
                Prefetch(
                    "availability_periods",
                    queryset=AvailabilityPeriod.objects.filter(is_available=True),
                )
            )
            .only(
                "title",
                "category",
                "description",
                "location",
                "is_available",
                "user__username",
                "pricing__base_price",
            )
        )

# Read-only viewset with caching, filtering and ordering capabilities.
@method_decorator(cache_page(60 * 15), name="list")
class ProductReadOnlyViewSet(BaseProductViewSet, ReadOnlyModelViewSet):
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = ProductFilter
    search_fields = ["title", "category", "description", "location"]
    ordering_fields = [
        "pricing__base_price",
        "created_at",
        "average_rating",
        "views_count",
    ]
    ordering = ["-created_at", "-average_rating", "pricing__base_price"]

    # Get active products with defined filters.
    def get_queryset(self):
        return self.get_base_queryset().filter(status="active")

    # Cache the list response to improve performance.
    def list(self, request, *args, **kwargs):
        category = request.query_params.get("category")
        location = request.query_params.get("location")
        page = request.query_params.get("page", 1)
        cache_key = f"product_list_{category}_{location}_page_{page}_v{settings.CACHE_VERSION}"
        cached_products = cache.get(cache_key)
        if not cached_products:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            serializer = self.get_serializer(page, many=True)
            cached_products = serializer.data
            cache.set(cache_key, cached_products, timeout=60 * 15)
        return Response(cached_products)

    # Retrieve a product with cached detail and increment views if needed.
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        cache_key = f"product_detail_{instance.pk}_v{settings.CACHE_VERSION}"
        if cached_data := cache.get(cache_key):
            return Response(cached_data)
        instance.increment_views()
        serializer = self.get_serializer(instance)
        cache.set(cache_key, serializer.data, timeout=60 * 15)
        return Response(serializer.data)

# Viewset for creating, updating, and deleting products.
class ProductWriteViewSet(BaseProductViewSet, ModelViewSet):
    def get_queryset(self):
        return self.get_base_queryset().filter(user=self.request.user)

    def perform_create(self, serializer):
        # Ensure only verified users create products.
        if not self.request.user.is_verified:
            raise PermissionDenied("Only verified users can post advertisements.")
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # Check that the user is verified and owns the product.
        if not self.request.user.is_verified:
            raise PermissionDenied("Only verified users can update advertisements.")
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only update your own products.")
        serializer.save()

    def perform_destroy(self, instance):
        # Ensure only verified users can delete their own products.
        if not self.request.user.is_verified:
            raise PermissionDenied("Only verified users can delete advertisements.")
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own products.")
        instance.delete()

    @action(detail=False, methods=["get"])
    def my_advertisements(self, request):
        # Custom action to list the advertisements of the logged-in user.
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def toggle_status(self, request, pk=None):
        # Allows a verified user to update the status of a product.
        if not self.request.user.is_verified:
            raise PermissionDenied("Only verified users can update advertisements.")
        product = self.get_object()
        new_status = request.data.get("status")
        if new_status in dict(Product._meta.get_field("status").choices):
            product.status = new_status
            product.save()
            return Response({"status": new_status})
        return Response({"error": "Invalid status"}, status=400)

# Base viewset for endpoints restricted to product owners.
class BaseUserRestrictedViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]

    # Check if the logged-in user has permission to modify the given product.
    def check_user_permission(self, product_id):
        if not Product.objects.filter(id=product_id, user=self.request.user).exists():
            raise PermissionDenied("You can only modify your own products' data.")

# Viewset for pricing options with user permission check.
class PricingOptionViewSet(BaseUserRestrictedViewSet):
    serializer_class = PricingOptionSerializer

    def get_queryset(self):
        return PricingOption.objects.filter(product__user=self.request.user)

    def perform_create(self, serializer):
        product_id = self.request.data.get("product")
        self.check_user_permission(product_id)
        serializer.save()

# Viewset for managing availability periods, ensuring user restrictions.
class AvailabilityPeriodViewSet(BaseUserRestrictedViewSet):
    serializer_class = AvailabilityPeriodSerializer

    def get_queryset(self):
        return AvailabilityPeriod.objects.filter(product__user=self.request.user)

    def perform_create(self, serializer):
        product_id = self.request.data.get("product")
        self.check_user_permission(product_id)
        serializer.save()
