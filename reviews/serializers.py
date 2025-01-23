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
        return obj.reviewer.get_full_name() or obj.reviewer.username

    def validate(self, data):
        # The model's clean method will handle most validation
        review = Review(**data)
        review.reviewer = self.context["request"].user
        review.clean()
        return data
      
    def validate_comment(self, value):
        if not value.strip():
            raise serializers.ValidationError("Comment cannot be empty.")
        return value
