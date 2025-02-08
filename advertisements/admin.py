# Django admin registrations for managing products, pricing options, and availability periods.

from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Product, PricingOption, AvailabilityPeriod

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Display fields in the product list view.
    list_display = [
        'title', 'category', 'user', 'status', 
        'is_available', 'views_count', 'average_rating'
    ]
    # Filters to narrow down the product list.
    list_filter = [
        'category', 'is_available', 'status', 
        ('created_at', admin.DateFieldListFilter)
    ]
    # Enables search on specific product fields.
    search_fields = ['title', 'description', 'location']
    # Read-only fields that are updated internally.
    readonly_fields = ['views_count', 'average_rating', 'created_at', 'updated_at']
    # Editable field list for quick modifications.
    list_editable = ['status', 'is_available']
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('title', 'category', 'description', 'image')
        }),
        (_('Rental Details'), {
            'fields': ('security_deposit', 'is_available', 'status')
        }),
        (_('Owner & Metadata'), {
            'fields': ('user', 'views_count', 'average_rating', 'created_at', 'updated_at')
        })
    )
    
    actions = ['mark_as_active', 'mark_as_suspended']

    # Action to mark selected products as active.
    def mark_as_active(self, request, queryset):
        queryset.update(status='active')
    mark_as_active.short_description = "Mark selected products as active"

    # Action to mark selected products as suspended.
    def mark_as_suspended(self, request, queryset):
        queryset.update(status='suspended')
    mark_as_suspended.short_description = "Mark selected products as suspended"
    

@admin.register(PricingOption)
class PricingOptionAdmin(admin.ModelAdmin):
    # Configure pricing option admin display.
    list_display = ['product', 'base_price', 'duration_unit', 'discount_percentage']
    list_filter = ['duration_unit']
    search_fields = ['product__title']
    

@admin.register(AvailabilityPeriod)
class AvailabilityPeriodAdmin(admin.ModelAdmin):
    # Configure availability period admin display.
    list_display = ['product', 'start_date', 'end_date', 'is_available']
    list_filter = ['is_available', 'start_date', 'end_date']
    search_fields = ['product__title', 'notes']