from django_filters import rest_framework as filters
from .models import CustomUser


class UserFilter(filters.FilterSet):
    """
    Filter set for user profiles.
    
    Allows filtering users by various criteria including location, rating,
    trust status, and verification status.
    """
    min_rating = filters.NumberFilter(field_name="average_rating", lookup_expr='gte')
    max_rating = filters.NumberFilter(field_name="average_rating", lookup_expr='lte')
    is_trusted = filters.BooleanFilter(field_name="is_trusted")
    
    class Meta:
        model = CustomUser
        fields = [
            'location',
            'average_rating',
            'min_rating',
            'max_rating',
            'is_trusted',
        ]