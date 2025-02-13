from django_filters import rest_framework as filters
from .models import Product


class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(
        field_name="pricing__base_price", lookup_expr="gte"
    )
    max_price = filters.NumberFilter(
        field_name="pricing__base_price", lookup_expr="lte"
    )
    min_rating = filters.NumberFilter(field_name="average_rating", lookup_expr="gte")
    categories = filters.MultipleChoiceFilter(
        field_name="category", choices=Product._meta.get_field("category").choices
    )

    class Meta:
        model = Product
        fields = {
            "category": ["exact", "in"],
            "location": ["exact", "icontains"],
            "is_available": ["exact"],
            "status": ["exact"],
            "average_rating": ["gte", "lte"],
        }
