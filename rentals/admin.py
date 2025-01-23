from django.contrib import admin
from .models import Rental, EscrowPayment

@admin.register(Rental)
class RentalAdmin(admin.ModelAdmin):
    list_display = ['id', 'renter', 'owner', 'product', 'status', 'start_time', 'end_time']
    list_filter = ['status', 'start_time', 'end_time']
    search_fields = ['renter__username', 'owner__username', 'product__title']

@admin.register(EscrowPayment)
class EscrowPaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'rental', 'status', 'held_amount', 'release_date']
    list_filter = ['status']
    search_fields = ['rental__id']
    actions = ['mark_as_completed', 'release_escrow']

    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')
    mark_as_completed.short_description = "Mark selected rentals as completed"

    def release_escrow(self, request, queryset):
        for escrow in queryset:
            escrow.release_to_owner()
    release_escrow.short_description = "Release escrow payments to owners"