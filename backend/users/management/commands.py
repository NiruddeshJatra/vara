from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Delete unverified users who registered more than a week ago'

    def handle(self, *args, **kwargs):
        one_week_ago = timezone.now() - timedelta(days=7)
        unverified_users = CustomUser.objects.filter(is_verified=False, created_at__lt=one_week_ago)
        count = unverified_users.count()
        unverified_users.delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {count} unverified users'))