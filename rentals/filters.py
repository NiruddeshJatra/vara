import django_filters
from .models import Rental

class RentalFilter(django_filters.FilterSet):
    # Filter rentals starting between specific dates.
    start_time = django_filters.DateFromToRangeFilter(field_name='start_time')
    # Filter rentals ending between specific dates.
    end_time = django_filters.DateFromToRangeFilter(field_name='end_time')
    # Filter rentals based on their current status.
    status = django_filters.ChoiceFilter(choices=Rental.STATUS_CHOICES)

    class Meta:
        model = Rental
        fields = ['start_time', 'end_time', 'status']