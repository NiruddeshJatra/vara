# from django.contrib import admin
# from .models import Payment

# @admin.register(Payment)
# class PaymentAdmin(admin.ModelAdmin):
#     list_display = ['transaction_id', 'user', 'amount', 'status', 'created_at']
#     list_filter = ['status', 'payment_method', 'created_at']
#     search_fields = ['transaction_id', 'user__email', 'user__username']
#     readonly_fields = ['transaction_id', 'created_at', 'updated_at']
#     actions = ['mark_as_completed', 'refund_payments']
    
#     def has_delete_permission(self, request, obj=None):
#         # Prevent deletion of payment records for audit purposes
#         return False

#     def mark_as_completed(self, request, queryset):
#         queryset.update(status='COMPLETED')
#     mark_as_completed.short_description = "Mark selected payments as completed"

#     def refund_payments(self, request, queryset):
#         for payment in queryset:
#             payment.refund()
#     refund_payments.short_description = "Refund selected payments"