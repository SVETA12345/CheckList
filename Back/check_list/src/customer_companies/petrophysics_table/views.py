from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from guardian.shortcuts import get_objects_for_user
from rest_framework import parsers, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView, get_object_or_404, RetrieveUpdateDestroyAPIView, ListAPIView, \
    RetrieveUpdateAPIView, DestroyAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated
from rest_framework.response import Response

from authorization_for_check.service_logics import send_all_permission, del_perm
from customer_companies.fields.models import Field
from customer_companies.petrophysics_table.models import Petrophysics_table
from customer_companies.petrophysics_table.serializers import Petrophysics_tableSerializer
from del_service.del_service_logic import post_delete_time, get_objs_time_del, recovery_object_and_children
from rest_framework.views import APIView
from django.http import JsonResponse
# создаёт/удаляет петрофизическую задачу
class Petrophysics_tableView(APIView):
    def get(self, request, pk_field, pk_method):
        try:
            p = Petrophysics_table.objects.get_or_create(
                method_id=pk_method,
                field_id=pk_field
            )
            p[0].save()
            json_data = {
                'id': p[0].id,
                'method': p[0].method_id,
                'separation_of_reservoirs': p[0].separation_of_reservoirs,
                'determination_nature_saturation': p[0].determination_nature_saturation,
                'determination_Kp': p[0].determination_Kp,
                'determination_Kng': p[0].determination_Kng,
                'determination_lithotype': p[0].determination_lithotype
            }
        except ObjectDoesNotExist:
            json_data = Petrophysics_table.objects.none()
        return Response(json_data)



# возвращает/удаляет/изменяет объект
class SinglePetrophysics_tableView(RetrieveUpdateDestroyAPIView):
    serializer_class = Petrophysics_tableSerializer
    parser_classes = (parsers.MultiPartParser, parsers.JSONParser)
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['petrophysics_table.view_petrophysics_table'],
                                            accept_global_perms=False).filter(time_deleted__isnull=True)

        except ObjectDoesNotExist:
            queryset = Petrophysics_table.objects.none()
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
class DestroyPetrophysics_tableView(DestroyAPIView):
    serializer_class = Petrophysics_tableSerializer
    parser_classes = (parsers.MultiPartParser, parsers.JSONParser)
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['petrophysics_table.view_petrophysics_table'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Petrophysics_table.objects.none()
        return queryset

    # переопределение функции удаления объектов: удаляются также всем возможные permissions
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        del_perm(instance)
        return super().destroy(request, *args, **kwargs)


# возвращает список удаленных
class DeletedPetrophysics_tableView(ListAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = Petrophysics_tableSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['petrophysics_table.view_petrophysics_table'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Petrophysics_table.objects.none()
        return queryset

    # переопределение функции, отвечающей на get-запрос, list_time - список времен до удаления объектов
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        response = get_objs_time_del(queryset, self.serializer_class)
        return Response(response)


# восстановление удаленного объекта
class RecoveryPetrophysics_tableView(RetrieveUpdateAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = Petrophysics_tableSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['petrophysics_table.view_petrophysics_table'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Petrophysics_table.objects.none()
        return queryset

    # восстановление - время в ноль
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            Field.objects.get(id=instance.field.pk, time_deleted__isnull=True)
            recovery_object_and_children(instance)
            response_data = self.serializer_class(instance).data
        except ObjectDoesNotExist:
            response_data = "Field was deleted"
        return Response(response_data)