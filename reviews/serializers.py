from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "reviewer",
            "reviewer_name",
            "rental",
            "review_type",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["reviewer", "created_at"]

    def get_reviewer_name(self, obj):
        # Return full name if available; otherwise use username.
        return obj.reviewer.get_full_name() or obj.reviewer.username

    def validate(self, data):
        # Instantiate model and run custom clean() method for additional validation.
        review = Review(**data)
        review.reviewer = self.context["request"].user
        review.clean()  # Validate review instance
        return data
      
    def validate_comment(self, value):
        # Ensure comment is not empty after stripping whitespace.
        if not value.strip():
            raise serializers.ValidationError("Comment cannot be empty.")
        return value
