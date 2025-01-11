from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from .models import Product, PricingOption, AvailabilityPeriod
from .serializers import ProductSerializer, PricingOptionSerializer, AvailabilityPeriodSerializer


# Separate ViewSet for Product Read-Only operations (List/Retrieve)
class ProductReadOnlyViewSet(ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['pricing__base_price', 'created_at']

    def get_queryset(self):
        queryset = Product.objects.prefetch_related('pricing', 'availability_periods').all()
        category = self.request.query_params.get('category', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        if category:
            queryset = queryset.filter(category=category)
        if min_price:
            queryset = queryset.filter(pricing__base_price__gte=min_price)
        if max_price:
            queryset = queryset.filter(pricing__base_price__lte=max_price)

        return queryset

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


# Separate ViewSet for Product Write Operations (Create/Update/Delete)
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
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


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
