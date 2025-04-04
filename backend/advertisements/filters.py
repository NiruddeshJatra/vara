from django_filters import rest_framework as filters
from .models import Product


class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(
        method='filter_by_min_price',
        help_text='Minimum price per unit'
    )
    max_price = filters.NumberFilter(
        method='filter_by_max_price',
        help_text='Maximum price per unit'
    )
    min_rating = filters.NumberFilter(field_name="average_rating", lookup_expr="gte")
    categories = filters.MultipleChoiceFilter(
        field_name="category", choices=Product._meta.get_field("category").choices
    )

    def filter_by_min_price(self, queryset, name, value):
        return queryset.filter(pricing_tiers__contains=[{'price__gte': value}])

    def filter_by_max_price(self, queryset, name, value):
        return queryset.filter(pricing_tiers__contains=[{'price__lte': value}])

    class Meta:
        model = Product
        fields = {
            "category": ["exact", "in"],
            "location": ["exact", "icontains"],
            "average_rating": ["gte", "lte"],
        }
