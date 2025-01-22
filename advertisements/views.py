# advertisements/views.py
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from .serializers import ProductSerializer, PricingOptionSerializer, AvailabilityPeriodSerializer
from .filters import ProductFilter


class ProductReadOnlyViewSet(ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['pricing__base_price', 'created_at', 'average_rating', 'views_count']
    ordering = ['-created_at']

    def get_queryset(self):
        return (
            Product.objects.select_related('user', 'pricing')
            .prefetch_related('availability_periods')
            .filter(status='active')
        )

    @method_decorator(cache_page(60 * 15))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
        
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class ProductWriteViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_advertisements(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
        
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        product = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Product._meta.get_field('status').choices):
            product.status = new_status
            product.save()
            return Response({'status': new_status})
        return Response({'error': 'Invalid status'}, status=400)
      
      
# ViewSet for PricingOption
class PricingOptionViewSet(ModelViewSet):
    serializer_class = PricingOptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PricingOption.objects.filter(product__user=self.request.user)

    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        if Product.objects.filter(id=product_id, user=self.request.user).exists():
            serializer.save()
        else:
            raise PermissionDenied("You can only add pricing options to your own products.")


# ViewSet for AvailabilityPeriod
class AvailabilityPeriodViewSet(ModelViewSet):
    serializer_class = AvailabilityPeriodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AvailabilityPeriod.objects.filter(product__user=self.request.user)

    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        if Product.objects.filter(id=product_id, user=self.request.user).exists():
            serializer.save()
        else:
            raise PermissionDenied("You can only add availability periods to your own products.")