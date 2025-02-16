from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Product, PricingOption, AvailabilityPeriod, ProductImage


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "category",
        "owner",
        "location",
        "is_available",
        "views_count",
        "rental_count",
        "average_rating",
        "pricing__base_price",
    ]
    list_filter = [
        "category",
        "is_available",
        ("created_at", admin.DateFieldListFilter),
    ]
    search_fields = ["title", "description", "location"]
    readonly_fields = ["views_count", "average_rating", "created_at", "updated_at"]
    ordering = ["-created_at"]

    fieldsets = (
        (
            _("Basic Information"),
            {"fields": ("title", "category", "description")},
        ),
        (
            _("Rental Details"),
            {"fields": ("security_deposit", "is_available")},
        ),
        (
            _("Owner & Metadata"),
            {
                "fields": (
                    "user",
                    "views_count",
                    "average_rating",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    actions = ["mark_as_active", "mark_as_suspended"]

    def mark_as_active(self, request, queryset):
        queryset.update(is_available=True)

    mark_as_active.short_description = "Mark selected products as active"

    def mark_as_suspended(self, request, queryset):
        queryset.update(is_available=False)

    mark_as_suspended.short_description = "Mark selected products as suspended"


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ["product", "image", "created_at"]
    list_filter = ["product"]


@admin.register(PricingOption)
class PricingOptionAdmin(admin.ModelAdmin):
    list_display = ["base_price", "duration_unit"]
    list_filter = ["duration_unit"]


@admin.register(AvailabilityPeriod)
class AvailabilityPeriodAdmin(admin.ModelAdmin):
    list_display = ["product", "start_date", "end_date", "is_available"]
    list_filter = ["is_available", "start_date", "end_date"]
    search_fields = ["product__title", "notes"]
