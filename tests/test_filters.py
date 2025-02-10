from django.test import TestCase
from users.models import CustomUser
from users.filters import UserFilter

class FiltersTest(TestCase):
    def setUp(self):
        CustomUser.objects.create_user(
            email="filter1@example.com",
            password="pass123",
            username="filter1",
            is_verified=True,
            location="Dhaka"
        )
        CustomUser.objects.create_user(
            email="filter2@example.com",
            password="pass123",
            username="filter2",
            is_verified=False,
            location="Chittagong"
        )

    def test_filter_by_verification(self):
        qs = CustomUser.objects.all()
        f = UserFilter({'is_verified': True}, qs)
        self.assertEqual(f.qs.count(), 1)

    def test_filter_by_location(self):
        qs = CustomUser.objects.all()
        f = UserFilter({'location': "Chittagong"}, qs)
        self.assertEqual(f.qs.count(), 1)
