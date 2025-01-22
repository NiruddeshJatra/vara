# advertisements/filters.py
from django_filters import rest_framework as filters
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from .models import Product

class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="pricing__base_price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="pricing__base_price", lookup_expr="lte")
    min_rating = filters.NumberFilter(field_name="average_rating", lookup_expr="gte")
    status = filters.ChoiceFilter(choices=Product._meta.get_field('status').choices)
    distance = filters.NumberFilter(method='filter_by_distance')
    category_group = filters.CharFilter(method='filter_by_category_group')
    
    class Meta:
        model = Product
        fields = {
            'category': ['exact', 'in'],
            'location': ['exact', 'icontains'],
            'is_available': ['exact'],
            'status': ['exact'],
            'average_rating': ['gte', 'lte'],
        }
        
    def filter_by_distance(self, queryset, name, value):
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        
        if lat and lng:
            user_location = Point(float(lng), float(lat))
            return queryset.filter(
                latitude__isnull=False,
                longitude__isnull=False
            ).annotate(
                distance=Distance('location', user_location)
            ).filter(distance__lte=D(km=value))
        return queryset
        
    def filter_by_category_group(self, queryset, name, value):
        return queryset.filter(category__in=Product.get_category_group(value))