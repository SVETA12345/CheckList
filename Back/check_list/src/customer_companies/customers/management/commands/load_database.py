from django.core.management.base import BaseCommand

from customer_companies.customers.management.commands.load import load_database


class Command(BaseCommand):
    help = 'Load data'

    def handle(self, *args, **kwargs):
        load_database()
        self.stdout.write("Success")
