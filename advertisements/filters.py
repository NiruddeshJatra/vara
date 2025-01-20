from django_filters import rest_framework as filters
from .models import Product, PricingOption

class ProductFilter(filters.FilterSet):
    base_price = filters.NumberFilter(field_name="pricing_options__base_price", lookup_expr="exact")
    min_price = filters.NumberFilter(field_name="pricing_options__base_price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="pricing_options__base_price", lookup_expr="lte")

    class Meta:
        model = Product
        fields = ['category', 'location', 'base_price', 'min_price', 'max_price']
