from rest_framework.exceptions import PermissionDenied
from .models import Field


class FieldFullGet:
    def __init__(self, user):
        self.exception = None
        self.data = {}
        self.customer = 0
        self.user = user  # для проверки доступа к объекту

    # возвращает параметры объекта field в словаре по pk_field
    def field(self, pk_field):
        try:
            field = Field.objects.get(id=pk_field)
            if self.user.has_perm('view_field', field):
                self.data.update({"field_id": field.pk, "field_name": field.name})
                if field.customer is None:
                    self.exception = "Customer Does Not Exist"
                    return
                self.customer = field.customer.pk
            else:
                raise PermissionDenied('You do not have permission to perform this action.')
        except Field.DoesNotExist:
            self.exception = "Field Does Not Exist"
        return
