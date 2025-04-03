from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Product, ProductImage


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "owner", "location", "status", "created_at"]
    list_filter = ["category", "status", "created_at"]
    search_fields = ["title", "description", "location", "owner__username"]
    date_hierarchy = "created_at"


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ["product", "image", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["product__title"]



