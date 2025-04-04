from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.utils import timezone
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from .models import Product, ProductImage
from .serializers import ProductSerializer, ProductImageSerializer
from .permissions import IsOwnerOrReadOnly
from django.core.files.storage import default_storage
import os

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product model.
    Provides CRUD operations and additional actions for products.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        """
        Custom queryset filtering based on user role and request type
        """
        queryset = super().get_queryset()
        
        # For list action, filter based on user role
        if self.action == 'list':
            if self.request.user.is_staff:
                return queryset
            # Regular users can see active products and their own products
            return queryset.filter(
                Q(status='active') | Q(owner=self.request.user)
            )
        
        return queryset

    def get_permissions(self):
        """
        Custom permission handling for different actions
        """
        if self.action in ['update_status']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def perform_create(self, serializer):
        """
        Set owner and initial status when creating a product
        """
        serializer.save(
            owner=self.request.user,
            status='draft'
        )

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Admin-only action to update product status
        """
        product = self.get_object()
        new_status = request.data.get('status')
        status_message = request.data.get('status_message', '')

        if new_status not in dict(Product.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        product.status = new_status
        product.status_message = status_message
        product.status_changed_at = timezone.now()
        product.save()

        return Response(self.get_serializer(product).data)

    @action(detail=True, methods=['post'])
    def upload_image(self, request, pk=None):
        """
        Upload an image for a product
        """
        product = self.get_object()
        if not request.FILES.get('image'):
            return Response(
                {'error': 'No image provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProductImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        """
        Delete a specific image from a product
        """
        product = self.get_object()
        image_id = request.data.get('image_id')
        
        try:
            image = product.images.get(id=image_id)
            # Delete the file from storage
            if image.image:
                default_storage.delete(image.image.path)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductImage.DoesNotExist:
            return Response(
                {'error': 'Image not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """
        Check product availability for a specific date or date range
        """
        product = self.get_object()
        date = request.query_params.get('date')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if date:
            is_available = product.is_date_available(date)
            return Response({'available': is_available})
        elif start_date and end_date:
            is_available = product.is_date_range_available(start_date, end_date)
            return Response({'available': is_available})
        
        return Response(
            {'error': 'Provide either date or start_date and end_date'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['get'])
    def pricing(self, request, pk=None):
        """
        Get pricing information for a product
        """
        product = self.get_object()
        duration = request.query_params.get('duration')
        unit = request.query_params.get('unit')

        if duration and unit:
            try:
                price = product.calculate_price(int(duration), unit)
                return Response({'price': price})
            except ValueError as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(
            {'error': 'Provide duration and unit'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['get'])
    def my_products(self, request):
        """
        List all products owned by the current user.
        """
        queryset = self.get_queryset().filter(owner=request.user)
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

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

