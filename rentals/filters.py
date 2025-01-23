import django_filters
from .models import Rental


class RentalFilter(django_filters.FilterSet):
    start_time = django_filters.DateFromToRangeFilter(field_name='start_time')
    end_time = django_filters.DateFromToRangeFilter(field_name='end_time')
    status = django_filters.ChoiceFilter(choices=Rental.STATUS_CHOICES)

    class Meta:
        model = Rental
        fields = ['start_time', 'end_time', 'status']