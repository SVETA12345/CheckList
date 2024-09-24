from datetime import datetime

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import ForeignKey
from django.http import Http404
from guardian.shortcuts import get_objects_for_user
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, RetrieveUpdateAPIView, \
    DestroyAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authorization_for_check.service_logics import get_default_permission_for_object, send_ready_permission, \
    send_permission_for_super_view, del_perm
from customer_companies.customers.management.commands.load import load_database
from customer_companies.customers.models import Customer
from customer_companies.customers.serializers import CustomerSerializer
from customer_companies.wells.serializers import WellSerializer
from del_service.del_service_logic import get_objs_time_del, post_delete_time, recovery_object_and_children


class CustomerQualView(APIView):
    """Общества у которых есть вся информация для шапки Качества данных"""

    def get(self, request):
        sql_request = """SELECT * FROM (SELECT customers_customer.*,
                         			   count(fields_field.name) AS fields_count,
                         			   count(clusters_cluster.name) AS cluster_count,
                         			   count(wells_well.id) AS wells_count,
                         			   count(wellbores_wellbore.id) AS wellbore_count
                         FROM public.customers_customer
                         JOIN public.fields_field
                         			   ON customers_customer.id = fields_field.customer_id 
                         FULL JOIN public.clusters_cluster
                         			   ON clusters_cluster.field_id = fields_field.id 
                         FULL JOIN public.wells_well
                         			   ON wells_well.cluster_id = clusters_cluster.id 
                         FULL JOIN public.wellbores_wellbore
                         			   ON wellbores_wellbore.well_id = wells_well.id
                         GROUP BY customers_customer.id) AS info_table
                         WHERE wellbore_count > 0 and time_deleted is null
                         """
        my_customers = Customer.objects.raw(sql_request)
        return Response(CustomerSerializer(my_customers, many=True).data)


class CustomerView(APIView):
    def get(self, request):
        my_customers = Customer.objects.filter(time_deleted__isnull=True)
        return Response(CustomerSerializer(my_customers, many=True).data)

    def post(self, request):
        try:
            customer = Customer.objects.get(name=request.data.get('name'), time_deleted__isnull=False)
            if customer.time_deleted is not None:
                del_perm(customer)
                customer.delete()
        except ObjectDoesNotExist:
            pass
        serializer = CustomerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.get(request)

    # дополняет метод создания
    # def create(self, request, *args, **kwargs):
    #     print('Создаём модель')
    #     try:
    #         customer = Customer.objects.get(name=request.data.get('name'), time_deleted__isnull=False)
    #         if customer.time_deleted is not None:
    #             del_perm(customer)
    #             customer.delete()
    #     except ObjectDoesNotExist:
    #         pass
    #     serializer = CustomerSerializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    #
    # # переопределение функции выполнения создания объекта (устанавливаются permissions для групп: superuser и superview
    # # - и для пользователя, который создал объект)
    # def perform_create(self, serializer):
    #     obj = serializer.save()
    #     permissions = get_default_permission_for_object(obj)
    #     print('permissions=', permissions)
    #     send_ready_permission(self.request.user, obj, permissions)
    #     send_permission_for_super_view(obj)
    #     return obj


# возвращает/удаляет/изменяет объект customer
class SingleCustomerView(RetrieveUpdateDestroyAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = CustomerSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['customers.view_customer'],
                                            accept_global_perms=False).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Customer.objects.none()
        return queryset

    # переопределение функции удаления объектов: удаляются также всем возможные permissions
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
class DestroyCustomerView(DestroyAPIView):
    serializer_class = Customer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        del_perm(instance)
        return super().destroy(request, *args, **kwargs)

    # переопределение функции удаления объектов: удаляются также всем возможные permissions
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['customers.view_customer'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Customer.objects.none()
        return queryset


# возвращает список удаленных customer
class DeletedCustomerView(ListAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = CustomerSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['customers.view_customer'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Customer.objects.none()
        return queryset

    # переопределение функции, отвечающей на get-запрос, list_time - список времен до удаления объектов
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        response = get_objs_time_del(queryset, self.serializer_class)
        return Response(response)


# восстановление удаленного customer
class RecoveryCustomerView(RetrieveUpdateAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = CustomerSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['customers.view_customer'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Customer.objects.none()
        return queryset

    # восстановление - время в ноль
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        recovery_object_and_children(instance)
        return Response(CustomerSerializer(instance).data)


class StasticsViewCountWell(APIView):
    permission_classes = [IsAuthenticated]

    def get_wells_count(self, request, format=None):
        response = []
        customers = get_objects_for_user(request.user, ['customers.view_customer'],
                                         accept_global_perms=False).filter(time_deleted__isnull=True)
        for customer in customers:
            wells_count = 0
            fields = get_objects_for_user(request.user, ['fields.view_field'],
                                          accept_global_perms=False).filter(time_deleted__isnull=True,
                                                                            customer=customer.pk)
            for field in fields:
                clusters = get_objects_for_user(request.user, ['clusters.view_cluster'],
                                                accept_global_perms=False).filter(time_deleted__isnull=True,
                                                                                  field=field.pk)
                for cluster in clusters:
                    wells_count = wells_count + get_objects_for_user(request.user, ['wells.view_well'],
                                                                     accept_global_perms=False).filter(
                        time_deleted__isnull=True,
                        cluster=cluster.pk).count()

            customer_dict = CustomerSerializer(customer).data
            customer_dict.update({"wells_count": wells_count})
            response.append(customer_dict)
        return response

    def get(self, request, format=None):
        return Response(self.get_wells_count(request, format))


class StasticsViewPercentWells(StasticsViewCountWell):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        response = self.get_wells_count(request, format)
        # TODO зачем код снизу?
        # stastics_count = get_objects_for_user(request.user, ['wells.view_well'],
        #                                       accept_global_perms=False).filter(time_deleted__isnull=True).count()
        #
        # for customer in response:
        #     count2 = 1 if customer["wells_count"] == 0 else customer["wells_count"]
        #     count1 = 1 if stastics_count == 0 else stastics_count
        #     customer["wells_count"] = round(100 / count1 * count2, 3)

        return Response(response)


class StasticsViewTimeWells(APIView):
    permission_classes = [IsAuthenticated]

    def get_well_time(self, request):
        well_time = []
        wells = get_objects_for_user(request.user, ['wells.view_well'],
                                     accept_global_perms=False).filter(
            time_deleted__isnull=True)
        for well in wells:
            time_list = []
            wellbores = get_objects_for_user(request.user, ['wellbores.view_wellbore'],
                                             accept_global_perms=False).filter(time_deleted__isnull=True,
                                                                               well=well.pk)
            for wellbore in wellbores:
                if wellbore.ILWD_TFS:
                    try:
                        date = datetime.fromisoformat(wellbore.ILWD_TFS)
                        time_list.append(datetime(date.year, date.month, 1))
                    except:
                        pass
            if len(time_list) != 0:
                min_time = min(time_list)
            else:
                min_time = None
            well_dict = WellSerializer(well).data
            well_dict.update({"ILWD_TFS": min_time})
            well_time.append(well_dict)
        return well_time

    def get(self, request, format=None):
        response = []
        time_dict = {}
        well_time = self.get_well_time(request)

        for well in well_time:
            if well["ILWD_TFS"] in time_dict.keys():
                time_dict[well["ILWD_TFS"]] = time_dict[well["ILWD_TFS"]] + 1
            else:
                time_dict[well["ILWD_TFS"]] = 1

        for time in time_dict.keys():
            response.append({"ILWD_TFS": time, "wells_count": time_dict[time]})

        return Response(response)


class StasticsViewQualityCustomer(APIView):
    permission_classes = [IsAuthenticated]

    def get_foreign_obj(self, child_obj):
        links = [field_name.name for field_name in child_obj._meta.get_fields() if
                 issubclass(type(field_name), ForeignKey)]
        return getattr(child_obj, links[0])

    def get_customer(self, child_obj):
        foreign_obj = self.get_foreign_obj(child_obj)
        if foreign_obj._meta.model_name != "customer":
            return self.get_customer(foreign_obj)
        else:
            return foreign_obj

    def get_quality_customers(self, quality_controls):
        customers = {}
        for quality_control in quality_controls:
            # if not quality_control.value:
            #     quality_value = 0
            # else:
            #     quality_value = quality_control.value
            if quality_control.value:
                customer = self.get_customer(quality_control)
                if customer.pk in customers.keys():
                    customers[customer.pk]["values"].append(quality_control.value)
                    # customers[customer.pk]["values"].append(quality_value)
                else:
                    customers[customer.pk] = {"values": [quality_control.value], "name": customer.name,
                                              "short": customer.short}
                    # customers[customer.pk] = {"values": [quality_value], "name": customer.name}
        return customers

    def get_customers(self, quality_controls):
        quality_customers = {}
        customers = self.get_quality_customers(quality_controls)

        for key_customer in customers.keys():
            customer_dict = customers[key_customer]
            main_value = round(sum(customer_dict["values"]) / len(customer_dict["values"]), 3)

            quality_customers.update({key_customer: {"name": customer_dict["name"],
                                                     "short": customer_dict["short"],
                                                     "value": main_value}})
        return quality_customers

    def get(self, request, format=None):
        response = []
        quality_controls = get_objects_for_user(self.request.user, ['quality_control.view_quality_control'],
                                                accept_global_perms=False).filter(time_deleted__isnull=True)
        quality_customers = self.get_customers(quality_controls)

        all_customers = get_objects_for_user(request.user, ['customers.view_customer'],
                                             accept_global_perms=False).filter(time_deleted__isnull=True)
        for customer in all_customers:
            customer_dict = {"id": customer.pk}
            if customer.pk in quality_customers.keys():
                customer_dict.update(quality_customers[customer.pk])
            else:
                customer_dict.update({"name": customer.name,
                                      "short": customer.short,
                                      "value": 0})

            response.append(customer_dict)

        return Response(response)


class LoadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        load_database()
        return Response(status=status.HTTP_200_OK)
