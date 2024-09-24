from guardian.shortcuts import get_objects_for_user
from rest_framework.exceptions import PermissionDenied
from .models import Customer


class CustomerFullGet:
    def __init__(self, user):
        self.exception = None
        self.data = {}
        self.user = user  # для проверки доступа к объекту

    # возвращает ключ и название объекта customer в словаре по pk_customer
    def customer(self, pk_customer):
        try:
            customer = get_objects_for_user(self.user, ['customers.view_customer'], accept_global_perms=False).\
                get(id=pk_customer)
            if self.user.has_perm('view_customer', customer):
                self.data.update({"customer_id": customer.pk, "customer_name": customer.name,
                                  'customer_short': customer.short})
            else:
                raise PermissionDenied('You do not have permission to perform this action.')
        except Customer.DoesNotExist:
            self.exception = "Customer Does Not Exist"
        return
