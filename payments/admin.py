from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'user', 'amount', 'status', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['transaction_id', 'user__email', 'user__username']
    readonly_fields = ['transaction_id', 'created_at', 'updated_at']
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of payment records for audit purposes
        return False