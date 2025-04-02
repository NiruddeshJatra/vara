from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Product, PricingOption, ProductImage


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "owner", "location", "is_available", "status", "created_at"]
    list_filter = ["category", "is_available", "status", "created_at"]
    search_fields = ["title", "description", "location", "owner__username"]
    date_hierarchy = "created_at"


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ["product", "image", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["product__title"]


@admin.register(PricingOption)
class PricingOptionAdmin(admin.ModelAdmin):
    list_display = ["base_price", "duration_unit", "minimum_rental_period", "maximum_rental_period"]
    list_filter = ["duration_unit", "minimum_rental_period"]
    search_fields = ["product__title"]
