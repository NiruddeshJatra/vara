from django_filters import rest_framework as filters
from django.db.models import Q
from .models import Product


class ProductFilter(filters.FilterSet):
    # Text search (title, category, product type)
    search = filters.CharFilter(
        method="filter_search", label="Search by title, category, or type"
    )

    # Location search
    location = filters.CharFilter(field_name="location", lookup_expr="icontains")

    # Price range filter
    min_price = filters.NumberFilter(
        field_name="pricing_tiers__price", lookup_expr="gte"
    )
    max_price = filters.NumberFilter(
        field_name="pricing_tiers__price", lookup_expr="lte"
    )

    # Availability filter
    start_date = filters.DateFilter(
        method="filter_availability", label="Available from date"
    )
    end_date = filters.DateFilter(
        method="filter_availability", label="Available until date"
    )

    # Duration unit filter
    duration_unit = filters.CharFilter(
        field_name="pricing_tiers__duration_unit", lookup_expr="iexact"
    )

    # Ordering filter
    ordering = filters.CharFilter(method="filter_ordering", label="Order by")

    def filter_search(self, queryset, name, value):
        """
        Search in product title, category, and product type
        """
        return queryset.filter(
            Q(title__icontains=value)
            | Q(category__iexact=value)
            | Q(product_type__iexact=value)
        ).distinct()

    def filter_availability(self, queryset, name, value):
        """
        Filter products available for the given date range
        """
        if name == "start_date":
            return queryset.filter(
                ~Q(unavailable_dates__date__gte=value)
                | ~Q(
                    unavailable_dates__range_start__lte=value,
                    unavailable_dates__range_end__gte=value,
                )
            ).distinct()
        elif name == "end_date":
            return queryset.filter(
                ~Q(unavailable_dates__date__lte=value)
                | ~Q(
                    unavailable_dates__range_start__lte=value,
                    unavailable_dates__range_end__gte=value,
                )
            ).distinct()
        return queryset

    def filter_ordering(self, queryset, name, value):
        """
        Order products by different criteria
        """
        if value in ["price_asc", "price_desc", "rating", "views"]:
            if value == "price_asc":
                return queryset.order_by("pricing_tiers__price")
            elif value == "price_desc":
                return queryset.order_by("-pricing_tiers__price")
            elif value == "rating":
                return queryset.order_by("-average_rating")
            elif value == "views":
                return queryset.order_by("-views_count")
        return queryset

    class Meta:
        model = Product
        fields = [
            "search",
            "location",
            "min_price",
            "max_price",
            "start_date",
            "end_date",
            "duration_unit",
            "ordering",
        ]
