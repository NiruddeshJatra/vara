from django.contrib import admin


class UserAdmin(admin.ModelAdmin):
    list_display = ["username", "full_name", "email", "phone_number", "location", "is_verified", "average_rating", "is_active", "is_trusted"]
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
                    "is_trusted",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
    )
    list_per_page = 25
    actions = ["mark_trusted", "ban_account"]

    def mark_trusted(self, request, queryset):
        queryset.update(is_trusted=True)

    mark_trusted.short_description = "Mark selected users as trusted"

    def ban_account(self, request, queryset):
        queryset.update(is_active=False)

    ban_account.short_description = "Ban selected users"

    @admin.display(description="Full Name")
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
