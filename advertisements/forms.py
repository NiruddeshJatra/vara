from django import forms
from .models import Product


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        exclude = ['user', 'created_at', 'updated_at']