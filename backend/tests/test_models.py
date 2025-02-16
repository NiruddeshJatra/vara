from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class ModelsTest(TestCase):
    def test_user_str(self):
        user = User.objects.create_user(email="model@example.com", password="pass123", username="modeluser")
        self.assertEqual(str(user), "modeluser")

    def test_update_average_rating(self):
        user = User.objects.create_user(email="rating@example.com", password="pass123", username="ratinguser")
        # Monkey-patch reviews_received to simulate an aggregate
        class DummyQuerySet:
            def aggregate(self, *args, **kwargs):
                return {"rating__avg": 4.256}
        user.reviews_received = DummyQuerySet()
        user.update_average_rating()
        self.assertEqual(user.average_rating, round(4.256, 2))
