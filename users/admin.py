from django.contrib import admin


class UserAdmin(admin.ModelAdmin):
    list_display = [
        "username",
        "full_name",
        "phone_number",
        "location",
        "is_verified",
        "created_at",
    ]
    search_fields = ["username", "email", "first_name", "last_name", "location"]
    list_filter = ["is_verified", "location", "is_active", "created_at"]
    ordering = ("-created_at",)
    list_editable = ("is_verified", "is_active")
    fieldsets = (
        (
            "Personal Information",
            {
                "fields": (
                    "username",
                    "email",
                    "first_name",
                    "last_name",
                    "phone_number",
                    "location",
                    "profile_picture",
                    "bio",
                    "date_of_birth",
                ),
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "is_verified",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
    )
    list_per_page = 25
    actions = ["mark_verified", "ban_account"]

    def mark_verified(self, request, queryset):
        queryset.update(is_verified=True)

    mark_verified.short_description = "Mark selected users as verified"
    
    def ban_account(self, request, queryset):
        queryset.update(is_active=False)

    ban_account.short_description = "Ban selected users"

    @admin.display(description="Full Name")
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
