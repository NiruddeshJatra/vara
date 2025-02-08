# Module: filters - Provides filtering capabilities for the CustomUser model.

from django_filters import rest_framework as filters
from .models import CustomUser

class UserFilter(filters.FilterSet):
    # Allows filtering by verification status and location.
    class Meta:
        model = CustomUser
        fields = ['is_verified', 'location']