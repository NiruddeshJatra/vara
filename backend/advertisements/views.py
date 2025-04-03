from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework import filters, status
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.utils import timezone
from .models import Product, PricingOption, ProductImage, PricingTier
from .serializers import (
    ProductSerializer,
    PricingOptionSerializer,
    ProductImageSerializer,
    PricingTierSerializer,
)
from .filters import ProductFilter
from .constants import STATUS_CHOICES


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user

class IsAdminOrOwner(permissions.BasePermission):
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
        is_available=True
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

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Admin endpoint to update product status
        """
        if not request.user.is_staff:
            return Response(
                {"detail": "Only administrators can update product status."},
                status=status.HTTP_403_FORBIDDEN
            )

        product = self.get_object()
        new_status = request.data.get('status')
        status_message = request.data.get('status_message', '')

        if new_status not in dict(STATUS_CHOICES):
            return Response(
                {"detail": "Invalid status provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        product.update_status(new_status, status_message)
        
        # Here you would typically trigger notifications to the owner
        # TODO: Implement notification system
        
        return Response({
            "status": "success",
            "message": f"Product status updated to {new_status}",
            "product": ProductSerializer(product).data
        })

    @action(detail=True, methods=['post'])
    def submit_for_review(self, request, pk=None):
        """
        Owner endpoint to submit a draft product for admin review
        """
        product = self.get_object()
        
        if product.owner != request.user:
            return Response(
                {"detail": "Only the product owner can submit for review."},
                status=status.HTTP_403_FORBIDDEN
            )

        if product.status != 'draft':
            return Response(
                {"detail": "Only draft products can be submitted for review."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Here you would typically trigger notifications to admins
        # TODO: Implement notification system
        
        return Response({
            "status": "success",
            "message": "Product submitted for review",
            "product": ProductSerializer(product).data
        })


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
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        return ProductImage.objects.filter(product__owner=self.request.user)


class PricingTierViewSet(ModelViewSet):
    queryset = PricingTier.objects.all()
    serializer_class = PricingTierSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        return PricingTier.objects.filter(product__owner=self.request.user)
