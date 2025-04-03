from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework import filters, status, permissions
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from .models import Product, ProductImage, PricingTier
from .serializers import (
    ProductSerializer,
    ProductImageSerializer,
    PricingTierSerializer,
)
from .filters import ProductFilter
from .constants import STATUS_CHOICES
from django.shortcuts import get_object_or_404


class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class IsAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.owner == request.user


class ProductViewSet(ReadOnlyModelViewSet):
    """
    Read-only endpoint for all users
    """

    queryset = Product.objects.select_related("owner", "pricing").filter(
        status='active'
    )
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrOwner]
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

    @action(detail=True, methods=["post"])
    def increment_views(self, request, pk=None):
        product = self.get_object()
        product.increment_views()
        return Response({"status": "views incremented"})

    @action(detail=True, methods=["post"])
    def update_rating(self, request, pk=None):
        product = self.get_object()
        new_rating = request.data.get("rating")
        if new_rating is not None:
            product.update_average_rating(float(new_rating))
            return Response({"status": "rating updated"})
        return Response(
            {"error": "rating not provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        """
        Admin endpoint to update product status
        """
        if not request.user.is_staff:
            return Response(
                {"detail": "Only administrators can update product status."},
                status=status.HTTP_403_FORBIDDEN,
            )

        product = self.get_object()
        new_status = request.data.get("status")
        status_message = request.data.get("status_message", "")

        if new_status not in dict(STATUS_CHOICES):
            return Response(
                {"detail": "Invalid status provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product.update_status(new_status, status_message)

        # Here you would typically trigger notifications to the owner
        # TODO: Implement notification system

        return Response(
            {
                "status": "success",
                "message": f"Product status updated to {new_status}",
                "product": ProductSerializer(product).data,
            }
        )

    @action(detail=True, methods=["post"])
    def submit_for_review(self, request, pk=None):
        """
        Owner endpoint to submit a draft product for admin review
        """
        product = self.get_object()

        if product.owner != request.user:
            return Response(
                {"detail": "Only the product owner can submit for review."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if product.status != "draft":
            return Response(
                {"detail": "Only draft products can be submitted for review."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Here you would typically trigger notifications to admins
        # TODO: Implement notification system

        return Response(
            {
                "status": "success",
                "message": "Product submitted for review",
                "product": ProductSerializer(product).data,
            }
        )


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


class ProductImageViewSet(ModelViewSet):
    """
    API endpoint for managing product images.
    """

    serializer_class = ProductImageSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        """
        Filter images by product ID if provided in the URL.
        Otherwise, return all images for the current user's products.
        """
        product_id = self.kwargs.get("product_pk")
        if product_id:
            return ProductImage.objects.filter(product_id=product_id).order_by("order")
        return ProductImage.objects.filter(product__owner=self.request.user).order_by(
            "order"
        )

    def perform_create(self, serializer):
        """
        Set the product when creating a new image.
        The order will be set automatically in the model's save method.
        """
        product_id = self.kwargs.get("product_pk")
        if product_id:
            product = get_object_or_404(Product, id=product_id, owner=self.request.user)
            serializer.save(product=product)
        else:
            raise ValidationError("Product ID is required to create an image.")


class PricingTierViewSet(ModelViewSet):
    queryset = PricingTier.objects.all()
    serializer_class = PricingTierSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        return PricingTier.objects.filter(product__owner=self.request.user)
