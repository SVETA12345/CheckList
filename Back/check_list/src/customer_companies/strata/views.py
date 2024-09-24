import json
import os
import io
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from guardian.shortcuts import get_objects_for_user
from rest_framework import status, parsers, viewsets
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, get_object_or_404, ListAPIView, \
    RetrieveUpdateAPIView, DestroyAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.http import Http404, FileResponse, HttpResponse
from authorization_for_check.service_logics import send_all_permission, del_perm
from del_service.del_service_logic import get_objs_time_del, post_delete_time, recovery_object_and_children
from .service_logics import CustomerCompaniesFullGet
from ..customers.models import Customer
from ..fields.models import Field
from .models import Strata
from .serializers import StrataSerializer
from django.core.files.storage import FileSystemStorage, default_storage
from rest_framework.views import APIView
from datetime import *
import openpyxl
# возвращает список без учета удаленных / создает объект
class StrataView(ListCreateAPIView):
    serializer_class = StrataSerializer
    parser_classes = (parsers.MultiPartParser, parsers.JSONParser)
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    # дополняет метод создания
    def create(self, request, *args, **kwargs):
        try:
            strata = Strata.objects.get(name=request.data.get('name'),
                                        field=self.kwargs.get('pk_field'))
            if strata.time_deleted is not None:
                del_perm(strata)
                strata.delete()
            else:
                return Response(self.serializer_class(strata).data)
        except ObjectDoesNotExist:
            pass
        except MultipleObjectsReturned:
            stratas = Strata.objects.filter(name=request.data.get('name'),
                                            field=self.kwargs.get('pk_field'))
            stratas.delete()
        return super().create(request, *args, **kwargs)

    # переопределение функции выполнения создания объекта (устанавливаются permissions)
    def perform_create(self, serializer):
        try:
            field = Field.objects.get(id=self.request.data.get('field_id'))
        except Field.DoesNotExist:
            field = get_object_or_404(Field, id=self.kwargs.get('pk_field'))

        if self.request.user.has_perm('add_field', field):
            strata = serializer.save(field=field)

            send_all_permission(self.request.user, strata, field)

            return strata
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['strata.view_strata'], accept_global_perms=False).\
                filter(field=self.kwargs.get('pk_field')).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Strata.objects.none()
        return queryset
# функция отрытия файла пласта
class StrataViewOpenFile(APIView):
    def get(self, request, pk):
        p = Strata.objects.get(
            id=pk
        )
        path = str(p.strata_file)
        if open(path, "rb"):
            response = HttpResponse(open(path, "rb"), content_type="application/vnd.ms-excel")
            response['Content-Disposition'] = 'inline; filename=some_file.xlsx'
            return response
        return Response({'status': 'Ошибка при отправке файла. Файл не найден!'})

#изменяет/удаляет объект Strata
class SingleStrataView(APIView):

    # обнавляем данные strata
    def put(self, request, pk):
        try:
            p = Strata.objects.get(
                id=pk
            )
            if request.FILES.get('strata_file'):
                file = default_storage.save(request.FILES.get('strata_file').name, request.FILES.get('strata_file'))
                file_name = request.FILES.get('strata_file').name
                path = os.getcwd() + '/check_list/src/files_root/' + file
                p.strata_file = path
                p.strata_file_name = file_name
            p.name = request.data.get("name")
            p.save()
            queryset = Response({'status': 'ok'})
        except ObjectDoesNotExist:
            queryset = Strata.objects.none()
        return queryset
    def delete(self, request, pk):
        try:
            p = Strata.objects.get(
                id=pk
            )
            p.time_deleted = date.today()
            p.save()
            return Response(StrataSerializer(p).data)
        except ObjectDoesNotExist:
            return Strata.objects.none()

# окончательное удаление
class DestroyStrataView(DestroyAPIView):
    serializer_class = StrataSerializer
    parser_classes = (parsers.MultiPartParser, parsers.JSONParser)
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['strata.view_strata'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Strata.objects.none()
        return queryset

    # переопределение функции удаления объектов: удаляются также всем возможные permissions
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        del_perm(instance)
        return super().destroy(request, *args, **kwargs)


# возвращает список удаленных Strata
class DeletedStrataView(ListAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = StrataSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['strata.view_strata'], accept_global_perms=False). \
                filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Strata.objects.none()
        return queryset

    # переопределение функции, отвечающей на get-запрос, list_time - список времен до удаления объектов
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        response = get_objs_time_del(queryset, self.serializer_class)
        for strata in response:
            try:
                field = Field.objects.get(id=strata["field_id"])
                strata.update({"field_name": field.name})
            except ObjectDoesNotExist:
                pass
        return Response(response)



# восстановление удаленного объекта
class RecoveryStrataView(RetrieveUpdateAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = StrataSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['strata.view_strata'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Field.objects.none()
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


# получение всей возможной информации по отчету
class CustomerCompaniesView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['customers.view_customer'], accept_global_perms=False).\
                filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Customer.objects.none()
        return queryset

    def get(self, *args, **kwargs):
        response_data = CustomerCompaniesFullGet(self.request.user).get_customers_companies()
        return Response(response_data)

    def get_file(self, *args, **kwargs):
        response_data = CustomerCompaniesFullGet(self.request.user).get_customers_companies()

        with open("files_root\\customers.json", "w", encoding='utf-8') as write_file:
            # write_file.write(str(response_data))
            json.dump(response_data, write_file)

        return Response({'file': f'http://10.23.125.230:5431/files/customers.json'})