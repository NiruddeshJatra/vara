from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'reviewer', 'rental', 'review_type', 'rating', 'created_at']
    list_filter = ['review_type', 'rating', 'created_at']
    search_fields = ['reviewer__username', 'rental__id', 'comment']
    actions = ['recalculate_average_ratings']

    def recalculate_average_ratings(self, request, queryset):
        # Loop over each review and update average ratings based on review type.
        for review in queryset:
            if review.review_type == 'property':
                review.rental.product.update_average_rating()  # Recalculate product rating
            elif review.reviewer == review.rental.renter:
                review.rental.owner.update_average_rating()  # Recalculate owner rating
            else:
                review.rental.renter.update_average_rating()  # Recalculate renter rating
    recalculate_average_ratings.short_description = "Recalculate average ratings"