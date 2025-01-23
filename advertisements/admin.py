from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Product, PricingOption, AvailabilityPeriod

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'user', 'status', 
        'is_available', 'views_count', 'average_rating'
    ]
    list_filter = [
        'category', 'is_available', 'status', 
        ('created_at', admin.DateFieldListFilter)
    ]
    search_fields = ['title', 'description', 'location']
    readonly_fields = ['views_count', 'average_rating', 'created_at', 'updated_at']
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('title', 'category', 'description', 'image')
        }),
        (_('Rental Details'), {
            'fields': ('security_deposit', 'is_available', 'status')
        }),
        (_('Location'), {
            'fields': ('location', 'latitude', 'longitude')
        }),
        (_('Owner & Metadata'), {
            'fields': ('user', 'views_count', 'average_rating', 'created_at', 'updated_at')
        })
    )

@admin.register(PricingOption)
class PricingOptionAdmin(admin.ModelAdmin):
    list_display = ['product', 'base_price', 'duration_unit', 'discount_percentage']
    list_filter = ['duration_unit']
    search_fields = ['product__title']

@admin.register(AvailabilityPeriod)
class AvailabilityPeriodAdmin(admin.ModelAdmin):
    list_display = ['product', 'start_date', 'end_date', 'is_available']
    list_filter = ['is_available', 'start_date', 'end_date']
    search_fields = ['product__title', 'notes']