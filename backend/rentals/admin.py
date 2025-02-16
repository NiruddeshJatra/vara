from django.contrib import admin
from .models import Rental

@admin.register(Rental)
class RentalAdmin(admin.ModelAdmin):
    # Display key rental attributes in the list view.
    list_display = ['id', 'renter', 'owner', 'product', 'status', 'start_time', 'end_time']
    # Allow filtering by status and rental time.
    list_filter = ['status', 'start_time', 'end_time']
    # Enable search over user and product fields.
    search_fields = ['renter__username', 'owner__username', 'product__title']
    
    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')
    mark_as_completed.short_description = "Mark selected rentals as completed"


# @admin.register(EscrowPayment)
# class EscrowPaymentAdmin(admin.ModelAdmin):
#     # Display key escrow payment attributes.
#     list_display = ['id', 'rental', 'status', 'held_amount', 'release_date']
#     list_filter = ['status']
#     search_fields = ['rental__id']
#     actions = ['mark_as_completed']

    

    # def release_escrow(self, request, queryset):
    #     # Release escrow funds for each selected record.
    #     for escrow in queryset:
    #         escrow.release_to_owner()
    # release_escrow.short_description = "Release escrow payments to owners"