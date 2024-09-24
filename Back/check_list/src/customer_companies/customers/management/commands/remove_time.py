from django.core.management.base import BaseCommand

from del_service.remov_by_time import remove


class Command(BaseCommand):
    help = 'Remove deleted objects'

    def handle(self, *args, **kwargs):
        remove()
        self.stdout.write("Success")
