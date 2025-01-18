from django.urls import path
from .views import CustomLoginView

urlpatterns = [
    path('auth/login/', CustomLoginView.as_view(), name='custom_login'),
]
