from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS
from django.db.models import F
from .models import Product
from .serializers import ProductSerializer
import logging

logger = logging.getLogger(__name__)

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user

class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product model.
    Provides CRUD operations and additional actions for products.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        """
        Filter products based on the user's role and request type.
        """
        if self.action == 'list':
            # For listing products, only show active products
            return Product.objects.filter(status='active')
        elif self.action == 'my_products':
            # For my_products, show all products owned by the user
            return Product.objects.filter(owner=self.request.user)
        return super().get_queryset()

    def perform_create(self, serializer):
        """
        Set the owner to the current user when creating a product.
        """
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def my_products(self, request):
        """
        List all products owned by the current user.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def submit_for_review(self, request, pk=None):
        """
        Submit a product for admin review.
        """
        product = self.get_object()
        if product.status != 'draft':
            return Response(
                {'error': 'Only draft products can be submitted for review'},
                status=status.HTTP_400_BAD_REQUEST
            )
        product.status = 'pending'
        product.save()
        return Response({'status': 'submitted for review'})

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Update the status of a product.
        Only allowed for product owners and admins.
        """
        product = self.get_object()
        new_status = request.data.get('status')
        message = request.data.get('message')

        if new_status not in dict(Product.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        product.update_status(new_status, message)
        return Response({'status': 'updated'})

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """
        Increment the view count for a product.
        """
        product = self.get_object()
        product.increment_views()
        return Response({'views_count': product.views_count})

    @action(detail=True, methods=['post'])
    def update_rating(self, request, pk=None):
        """
        Update the average rating for a product.
        """
        product = self.get_object()
        new_rating = request.data.get('rating')

        try:
            new_rating = float(new_rating)
            if not 0 <= new_rating <= 5:
                raise ValueError
        except (TypeError, ValueError):
            return Response(
                {'error': 'Rating must be a number between 0 and 5'},
                status=status.HTTP_400_BAD_REQUEST
            )

        product.update_average_rating(new_rating)
        return Response({'average_rating': product.average_rating})

