from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from .models import Product, ProductImage
from .serializers import (
    ProductSerializer,
    ProductImageSerializer,
)
from .permissions import IsOwnerOrReadOnly
from django.core.files.storage import default_storage
import logging
from django.db import transaction
from rest_framework.exceptions import ValidationError

logger = logging.getLogger(__name__)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 80


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == "list":
            if self.request.user.is_staff:
                return queryset
            return queryset.filter(Q(status__in=["active", "draft"]) | Q(owner=self.request.user))
        return queryset

    def get_permissions(self):
        if self.action in ["update_status"]:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        logger.info(f"CREATE method called on ProductViewSet")
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating product: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        logger.info(f"Update method called with data: {request.data}")
        
        instance = self.get_object()
        logger.info(f"Updating product with ID: {instance.id}")
        
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(
            instance, 
            data=request.data, 
            partial=partial,
            context={'request': request, 'is_update': True}  # Mark this as an update
        )
        
        serializer.is_valid(raise_exception=True)
        
        # Log validated data
        logger.info(f"Validated data: {serializer.validated_data}")
        
        self.perform_update(serializer)
        
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, status="draft")
        
    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        product = self.get_object()
        new_status = request.data.get("status")
        status_message = request.data.get("status_message", "")

        try:
            product.update_status(new_status, status_message)
            return Response(self.get_serializer(product).data)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def upload_image(self, request, pk=None):
        product = self.get_object()
        if not request.FILES.get("image"):
            return Response(
                {"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Create image serializer with proper context for absolute URLs
        serializer = ProductImageSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            # Explicitly save to product_images related name
            image = serializer.save(product=product)
            logger.info(f"Added image {image.id} to product {product.id}")
            
            # Refresh the product from DB to ensure we get latest images
            product = Product.objects.get(id=product.id)
            logger.info(f"Product now has {product.product_images.count()} images")
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["delete"])
    def delete_image(self, request, pk=None):
        product = self.get_object()
        image_id = request.data.get("image_id")

        try:
            image = product.images.get(id=image_id)
            if image.image:
                default_storage.delete(image.image.path)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductImage.DoesNotExist:
            return Response(
                {"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=["get"])
    def availability(self, request, pk=None):
        product = self.get_object()
        date = request.query_params.get("date")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        try:
            if date:
                is_available = product.is_date_available(date)
            elif start_date and end_date:
                is_available = product.is_date_range_available(start_date, end_date)
            else:
                raise ValidationError("Provide either date or start_date and end_date")

            return Response({"available": is_available})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def pricing(self, request, pk=None):
        product = self.get_object()
        duration = request.query_params.get("duration")
        unit = request.query_params.get("unit")

        try:
            if not duration or not unit:
                raise ValidationError("Provide duration and unit")

            price = product.calculate_price(int(duration), unit)
            return Response({"price": price})
        except (ValidationError, ValueError) as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def my_products(self, request):
        queryset = self.get_queryset().filter(owner=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def submit_for_review(self, request, pk=None):
        product = self.get_object()
        try:
            product.submit_for_review()
            return Response({"status": "submitted for review"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def increment_views(self, request, pk=None):
        product = self.get_object()
        product.increment_views()
        return Response({"views_count": product.views_count})

    @action(detail=True, methods=["post"])
    def update_rating(self, request, pk=None):
        product = self.get_object()
        new_rating = request.data.get("rating")

        try:
            product.update_average_rating(new_rating)
            return Response({"average_rating": product.average_rating})
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
