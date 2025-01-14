from django_filters import rest_framework as filters
from .models import Complaint

class ComplaintFilter(filters.FilterSet):
    created_after = filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Complaint
        fields = ['status', 'complainant', 'against_user', 'rental_request']