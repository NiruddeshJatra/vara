from django_filters import rest_framework as filters

class UserFilter(filters.FilterSet):
    joined_after = filters.DateTimeFilter(field_name='date_joined', lookup_expr='gte')
    is_verified = filters.BooleanFilter()
    
    class Meta:
        model = CustomUser
        fields = ['is_verified', 'location']