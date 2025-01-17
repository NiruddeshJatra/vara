from django_filters import rest_framework as filters

class UserFilter(filters.FilterSet):
    class Meta:
        model = CustomUser
        fields = ['is_verified', 'location']