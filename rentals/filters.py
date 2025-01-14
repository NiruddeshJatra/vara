import django_filters
from .models import Rental


class RentalFilter(django_filters.FilterSet):
    start_time = django_filters.DateTimeFilter(field_name='start_time', lookup_expr='gte')
    end_time = django_filters.DateTimeFilter(field_name='end_time', lookup_expr='lte')
    status = django_filters.CharFilter(field_name='status', lookup_expr='iexact')

    class Meta:
        model = Rental
        fields = ['start_time', 'end_time', 'status']