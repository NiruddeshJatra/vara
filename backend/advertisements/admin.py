from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "owner", "location", "status", "created_at"]
    list_filter = ["category", "status", "created_at"]
    search_fields = ["title", "description", "location", "owner__username"]
    date_hierarchy = "created_at"




