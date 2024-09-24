from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_objects_for_user
from rest_framework.exceptions import PermissionDenied
from .models import Field, Strata
from .serializers import StrataSerializer
from ..customers.models import Customer
from ..customers.serializers import CustomerSerializer
from ..fields.serializers import FieldSerializer


class CustomerCompaniesFullGet:
    def __init__(self, user):
        self.response = []
        self.user = user  # для проверки доступа к объекту

    def get_customers_companies(self):
        try:
            customers = get_objects_for_user(self.user, ['customers.view_customer'], accept_global_perms=False).\
                filter(time_deleted__isnull=True)
            # customers = Customer.objects.filter(time_deleted__isnull=True)

            for customer in customers:
                self.response = self.response + [self.get_custumer(customer)]

        except ObjectDoesNotExist:
            self.response = Customer.objects.none()
        return self.response

    def get_custumer(self, customer):
        customer_dict = {"name": CustomerSerializer(customer).data["name"]}
        customer_dict.update(self.get_fields(customer))

        return customer_dict

    def get_fields(self, customer):
        fields_to_customer = {}
        try:
            fields = get_objects_for_user(self.user, ['fields.view_field'], accept_global_perms=False). \
                filter(customer=customer.pk).filter(time_deleted__isnull=True)

            # fields = Field.objects.filter(time_deleted__isnull=True)

            fields_to_customer['fields'] = self.get_list_fields(fields)
        except ObjectDoesNotExist:
            fields_to_customer['fields'] = Field.objects.none()
        return fields_to_customer

    def get_list_fields(self, fields):
        field_list = []
        for field in fields:
            field_list = field_list + [self.get_field(field)]
        return field_list

    def get_field(self, field):
        field_dict = {"name": FieldSerializer(field).data["name"]}
        field_dict.update(self.get_stratas(field))

        return field_dict

    def get_stratas(self, field):
        stratas_to_field = {}
        try:
            stratas = get_objects_for_user(self.user, ['strata.view_strata'], accept_global_perms=False).\
                filter(field=field.pk).filter(time_deleted__isnull=True)
            # stratas = Strata.objects.filter(time_deleted__isnull=True)

            stratas_to_field['stratas'] = self.get_list_stratas(stratas)
        except ObjectDoesNotExist:
            stratas_to_field['stratas'] = Strata.objects.none()
        return stratas_to_field

    def get_list_stratas(self, stratas):
        strata_list = []
        for strata in stratas:
            strata_list = strata_list + [{"name": StrataSerializer(strata).data["name"]}]
        return strata_list