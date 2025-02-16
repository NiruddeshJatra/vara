from django.contrib import admin
from .models import Complaint, ComplaintUpdate

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'title', 'complainant', 'against_user', 
        'status', 'priority', 'category', 'created_at'
    ]
    list_filter = [
        'status', 'priority', 'category', 
        ('created_at', admin.DateFieldListFilter)
    ]
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at', 'last_status_change']
    actions = ['mark_as_resolved', 'escalate_complaints']
    
    fieldsets = (
        ('Complaint Details', {
            'fields': ('title', 'category', 'description', 'evidence')
        }),
        ('Parties Involved', {
            'fields': ('complainant', 'against_user', 'rental_request')
        }),
        ('Status & Processing', {
            'fields': ('status', 'priority', 'assigned_to', 'admin_notes')
        }),
        ('Resolution', {
            'fields': ('resolution_notes', 'resolution_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'last_status_change', 'response_deadline')
        })
    )
    def mark_as_resolved(self, request, queryset):
        queryset.update(status='resolved', resolution_date=timezone.now())
    mark_as_resolved.short_description = "Mark selected complaints as resolved"

    def escalate_complaints(self, request, queryset):
        queryset.update(status='escalated')
    escalate_complaints.short_description = "Escalate selected complaints"

@admin.register(ComplaintUpdate)
class ComplaintUpdateAdmin(admin.ModelAdmin):
    list_display = ['complaint', 'user', 'created_at']
    list_filter = [('created_at', admin.DateFieldListFilter)]
    search_fields = ['message']