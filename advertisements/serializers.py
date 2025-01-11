from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
      model = Product
      fields = ['title', 'description', 'price', 'image']
      read_only_fields = ['id', 'created_at', 'updated_at', 'user']