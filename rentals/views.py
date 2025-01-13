from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework import filters
from .models import Rentals
from .serializers import RentalRequestSerializer


# Create your views here.
class RentalRequestViewSet(ModelViewSet):
    serializer_class = RentalRequestSerializer