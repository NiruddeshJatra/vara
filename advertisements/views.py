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


@method_decorator(cache_page(60 * 15), name='list')
class ProductReadOnlyViewSet(ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['title', 'category', 'description', 'location']
    ordering_fields = ['pricing__base_price', 'created_at', 'average_rating', 'views_count']
    ordering = ['-created_at', '-average_rating', 'pricing__base_price']

    def get_queryset(self):
        return (
            Product.objects.select_related('user', 'pricing')
            .prefetch_related(
                Prefetch('availability_periods', 
                      queryset=AvailabilityPeriod.objects.filter(is_available=True))
            )
            .only(
                'title', 'category', 'description', 
                'location', 'is_available', 'user__username',
                'pricing__base_price'
            )
            .filter(status='active')
        )

    def list(self, request, *args, **kwargs):
        category = request.query_params.get('category')
        location = request.query_params.get('location')
        page = request.query_params.get('page', 1)  # Get current page
        cache_key = f'product_list_{category}_{location}_page_{page}'
        
        cached_products = cache.get(cache_key)
        if not cached_products:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            serializer = self.get_serializer(page, many=True)
            cached_products = serializer.data
            cache.set(cache_key, cached_products, timeout=60 * 15)
        
        return Response(cached_products)
        
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        cache_key = f'product_detail_{instance.pk}'
        if cached_data := cache.get(cache_key):
            return Response(cached_data)

        instance.increment_views()
        serializer = self.get_serializer(instance)
        cache.set(cache_key, serializer.data, timeout=60 * 15)  # Cache for 15 minutes
        return Response(serializer.data)


class ProductWriteViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only update your own products.")
        serializer.save()

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