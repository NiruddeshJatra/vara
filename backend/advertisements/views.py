from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from .models import Product, ProductImage
from .serializers import (
    ProductSerializer,
    ProductImageSerializer,
)
from .permissions import IsOwnerOrReadOnly
from django.core.files.storage import default_storage
from django.db import transaction
from rest_framework.exceptions import ValidationError
import json
from django.http import HttpResponse
import logging
import time

# --- Health check endpoint for AWS Load Balancer ---
def health_check(request):
    """Simple health check endpoint for AWS Target Group. Always returns 200 OK."""
    logger = logging.getLogger("health_check")
    start = time.monotonic()
    logger.info(f"/health/ endpoint hit from {request.META.get('REMOTE_ADDR')}")
    resp = HttpResponse("OK", status=200)
    duration = time.monotonic() - start
    logger.info(f"/health/ endpoint completed in {duration:.4f}s")
    return resp

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
    logger = logging.getLogger("product_viewset")

    def get_serializer(self, *args, **kwargs):
        # Ensure all uploaded images are passed as a list to the serializer
        if self.request.method in ["POST", "PUT", "PATCH"]:
            data = kwargs.get('data', None) or self.request.data.copy()
            if hasattr(self.request, 'FILES'):
                images = self.request.FILES.getlist('images')
                if images:
                    data.setlist('images', images)
            kwargs['data'] = data
        return super().get_serializer(*args, **kwargs)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = super().get_queryset()
        # Optimize DB queries for product list
        queryset = queryset.select_related('owner').prefetch_related('product_images')
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
        try:
            serializer = self.get_serializer(data=request.data)
            
            serializer.is_valid(raise_exception=True)
            
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print("Error in create:", str(e))
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(
            instance, 
            data=request.data, 
            partial=partial,
            context={'request': request, 'is_update': True}
        )
        
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": _("An unexpected error occurred while updating the product")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, status="draft")
        
    def perform_update(self, serializer):
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        if product.owner != request.user:
            self.logger.warning(f"User {request.user.id} attempted to delete product {product.id} not owned by them.")
            return Response({"error": "You do not have permission to delete this product."}, status=status.HTTP_403_FORBIDDEN)
        self.logger.info(f"User {request.user.id} deleting product {product.id}")
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        product = self.get_object()
        new_status = request.data.get("status")
        status_message = request.data.get("status_message", "")

        if not new_status:
            return Response(
                {"error": _("Status is required")},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product.update_status(new_status, status_message)
            return Response(self.get_serializer(product).data)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def upload_image(self, request, pk=None):
        self.logger.info(f"[START] upload_image for product {pk} by user {request.user.id}")
        start = time.monotonic()
        product = self.get_object()
        if not request.FILES.get("image"):
            self.logger.warning(f"No image provided for upload_image by user {request.user.id}")
            return Response(
                {"error": _("No image provided")}, status=status.HTTP_400_BAD_REQUEST
            )
        serializer = ProductImageSerializer(
            data=request.data, 
            context={'request': request}
        )
        if serializer.is_valid():
            image = serializer.save(product=product)
            product = Product.objects.get(id=product.id)
            duration = time.monotonic() - start
            self.logger.info(f"[END] upload_image for product {pk} by user {request.user.id} in {duration:.4f}s")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        duration = time.monotonic() - start
        self.logger.warning(f"[VALIDATION ERROR] upload_image for product {pk} by user {request.user.id} after {duration:.4f}s: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # TODO: Consider offloading image processing to Celery

    @action(detail=True, methods=["delete"])
    def delete_image(self, request, pk=None):
        self.logger.info(f"[START] delete_image for product {pk} by user {request.user.id}")
        start = time.monotonic()
        product = self.get_object()
        image_id = request.data.get("image_id")
        if not image_id:
            self.logger.warning(f"No image_id provided for delete_image by user {request.user.id}")
            return Response(
                {"error": _("Image ID is required")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            image = product.images.get(id=image_id)
            if image.image:
                default_storage.delete(image.image.path)
            image.delete()
            duration = time.monotonic() - start
            self.logger.info(f"[END] delete_image for product {pk} by user {request.user.id} in {duration:.4f}s")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductImage.DoesNotExist:
            duration = time.monotonic() - start
            self.logger.warning(f"[NOT FOUND] delete_image for product {pk} by user {request.user.id} after {duration:.4f}s: Image not found")
            return Response(
                {"error": _("Image not found")}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            duration = time.monotonic() - start
            self.logger.error(f"[EXCEPTION] delete_image for product {pk} by user {request.user.id} after {duration:.4f}s: {e}", exc_info=True)
            return Response(
                {"error": _("An error occurred while deleting the image")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        # TODO: Consider offloading file deletion to Celery if storage is slow

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
                raise ValidationError(_("Provide either date or start_date and end_date"))

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
                raise ValidationError(_("Provide duration and unit"))

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
            return Response({"status": _("submitted for review")})
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
