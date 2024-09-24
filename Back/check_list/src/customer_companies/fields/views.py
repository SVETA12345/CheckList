from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_objects_for_user
from rest_framework import status, viewsets
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, get_object_or_404, ListAPIView, \
    RetrieveUpdateAPIView, DestroyAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from authorization_for_check.service_logics import send_all_permission, del_perm
from del_service.del_service_logic import get_time_before_del, delete_time, post_delete_time_children, \
    get_objs_time_del, post_null_delete_time, post_delete_time, recovery_object_and_children
from service_companies.methods.models import Method
from ..customers.models import Customer
from .models import Field
from .serializers import FieldSerializer
from ..customers.serializers import CustomerSerializer


# возвращает список field без учета удаленных / создает объект field
from ..petrophysics_table.models import PETR_DEFAULT, Petrophysics_table
from ..petrophysics_table.serializers import Petrophysics_tableSerializer


class FieldView(ListCreateAPIView):
    serializer_class = FieldSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # дополняет метод создания
    def create(self, request, *args, **kwargs):
        try:
            field = Field.objects.get(name=request.data.get('name'), time_deleted__isnull=False)
            if field.time_deleted is not None:
                del_perm(field)
                field.delete()
        except ObjectDoesNotExist:
            pass
        return super().create(request, *args, **kwargs)

    # переопределение функции выполнения создания объекта (устанавливаются permissions)
    def perform_create(self, serializer):
        try:
            customer = Customer.objects.get(id=self.request.data.get('customer_id'))
        except Customer.DoesNotExist:
            customer = get_object_or_404(Customer, id=self.kwargs.get('pk_customer'))

        if self.request.user.has_perm('add_customer', customer):
            field = serializer.save(customer=customer)

            send_all_permission(self.request.user, field, customer)
            self.create_petrophysics(field)

            return field
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    def create_petrophysics(self, field):
        for key in PETR_DEFAULT.keys():
            field_names = ["separation_of_reservoirs", "determination_nature_saturation", "determination_Kp",
                          "determination_Kng", "determination_lithotype"]
            try:
                method = Method.objects.get(name=key)
                data = {}
                for i, name in enumerate(field_names):
                    data.update({name: PETR_DEFAULT[key][i]})

                serializer = Petrophysics_tableSerializer(data=data)
                serializer.is_valid()

                serializer.save(field=field, method=method)
            except ObjectDoesNotExist:
                pass

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['fields.view_field'], accept_global_perms=False). \
                filter(customer=self.kwargs.get('pk_customer')).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Field.objects.none()
        return queryset


# возвращает/удаляет/изменяет объект Field
class SingleFieldView(RetrieveUpdateDestroyAPIView):
    serializer_class = FieldSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['fields.view_field'],
                                            accept_global_perms=False).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Field.objects.none()
        return queryset

    # переопределение функции удаления объектов
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            # del_perm(instance)
            # self.perform_destroy(instance) # выполнение удаления
            # записывается дата удаления для объекта и всех связанных объектов
            post_delete_time(instance)
        except Http404:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)


# окончательное удаление
class DestroyFieldView(DestroyAPIView):
    serializer_class = FieldSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции удаления объектов: удаляются также всем возможные permissions
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        del_perm(instance)
        return super().destroy(request, *args, **kwargs)

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['fields.view_field'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Field.objects.none()
        return queryset


# возвращает не удаленные списки customer + их fields / возвращает удаленные списки customer + их fields
class CustomerFieldsView(viewsets.ModelViewSet):
    response = []
    permission_classes = [IsAuthenticated]

    # возвращает для customer данные в словаре
    def get_customer_dict(self, customer, time_deleted__isnull):
        customer_dict = CustomerSerializer(customer).data
        customer_dict.update(self.get_dict_with_fields(customer.pk, time_deleted__isnull))

        # # в случае удаленных к каждому элементу добавляется время до удаления
        # if not time_deleted__isnull:
        #     customer_dict.update(get_time_before_del(customer))
        return customer_dict

    # возвращает список из queryset объектов fields
    def get_list_of_fields(self, fields, time_deleted__isnull):
        field_list = []
        for field in fields:
            field_dict = FieldSerializer(field).data

            # # в случае удаленных к каждому элементу добавляется время до удаления
            # if not time_deleted__isnull:
            #     field_dict.update(get_time_before_del(field))

            field_list = field_list + [field_dict]
        return field_list

    # возвращает для customer словарь со списком его fields
    def get_dict_with_fields(self, customer_id, time_deleted__isnull):
        fields_to_customer = {}
        try:
            fields = get_objects_for_user(self.request.user, ['fields.view_field'], accept_global_perms=False). \
                filter(customer=customer_id).filter(time_deleted__isnull=time_deleted__isnull)

            fields_to_customer['field'] = self.get_list_of_fields(fields, time_deleted__isnull)
        except Field.DoesNotExist:
            fields_to_customer['field'] = Field.objects.none()
        return fields_to_customer

    # возвращает response c данными / пустой в случае их отсутствия
    def return_response(self, time_deleted__isnull):
        try:
            self.queryset = get_objects_for_user(self.request.user, ['customers.view_customer'], accept_global_perms=False).\
                filter(time_deleted__isnull=time_deleted__isnull)

            for customer in self.queryset:
                self.response = self.response + [self.get_customer_dict(customer, time_deleted__isnull)]

        except Customer.DoesNotExist:
            return Response(Customer.objects.none())
        return Response(self.response)

    # возвращает не удаленные списки customer + их fields
    def list(self, request, *args, **kwargs):
        return self.return_response(True)

    # # возвращает удаленные списки customer + их fields
    # def deleted_list(self, request):
    #     return self.return_response(False)


# возвращает список удаленных field
class DeletedFieldView(ListAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = FieldSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['fields.view_field'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Field.objects.none()
        return queryset

    # переопределение функции, отвечающей на get-запрос, list_time - список времен до удаления объектов
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        response = get_objs_time_del(queryset, self.serializer_class)
        for field in response:
            try:
                customer = Customer.objects.get(id=field["customer_id"])
                field.update({"customer_name": customer.name, "short_customer": customer.short})
            except ObjectDoesNotExist:
                pass
        return Response(response)


# восстановление удаленного field
class RecoveryFieldView(RetrieveUpdateAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = FieldSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['fields.view_field'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Field.objects.none()
        return queryset

    # восстановление - время в ноль
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            Customer.objects.get(id=instance.customer.pk, time_deleted__isnull=True)
            recovery_object_and_children(instance)
            response_data = FieldSerializer(instance).data
        except ObjectDoesNotExist:
            response_data = "Customer was deleted"
        return Response(response_data)