import json

from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.generics import DestroyAPIView, \
    get_object_or_404, CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated, DjangoObjectPermissions
from rest_framework.response import Response
from rest_framework.views import APIView

from authorization_for_check.service_logics import del_perm
from del_service.del_service_logic import delete_time, post_delete_time_children, \
    post_null_delete_time, recovery_object_and_children, get_time_before_del
from .service_logics import GetServiceMethodDeviceForService, DeviceMethodGetForService, ServiceCompaniesFullGet
from ..methods.models import Method
from ..services.models import Service
from .models import Service_method, Service_device
from .serializers import Service_methodSerializer


class Service_methodCreateView(CreateAPIView):
    # создание service_method (из service, method, service_device)
    # если потребуется выводить только для метода, менять на ListCreateAPIView, переносить get_queryset,
    # также поменять url
    serializer_class = Service_methodSerializer
    permission_classes = [IsAuthenticated]
    #
    # def get_queryset(self):
    #     # id_devices = Service_method.objects.all().values('service_device').filter(time_deleted__isnull=True)
    #     try:
    #         queryset = Service_device.objects.filter(time_deleted__isnull=True)
    #     except ObjectDoesNotExist:
    #         queryset = Service_device.objects.none()
    #     return queryset
    #     return Service_device.objects.filter(id__in=id_devices).filter(time_deleted__isnull=True)

    # переопределение функции получения queryset объекта
    def get_service_device(self):
        try:
            service_device = Service_device.objects.get(tool_type=self.request.data.get('tool_type'))
            if service_device.time_deleted:
                service_device.time_deleted = None
                service_device.save()
        except Service_device.DoesNotExist:
            service_device = Service_device.objects.create(tool_type=self.request.data.get('tool_type'))
        return service_device

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    # переопределение функции выполнения создания объекта
    def perform_create(self, serializer):
        # получение неудаленного service по pk_service
        service = get_object_or_404(Service, id=self.kwargs.get('pk_service'), time_deleted__isnull=True)
        # получение метода по pk_method
        method = get_object_or_404(Method, id=self.kwargs.get('pk_method'))
        # получение/создание неудаленного девайса по tool_type
        service_device = self.get_service_device()

        try:
            service_method = Service_method.objects.get(service_device=service_device, method=method, service=service)
            if not service_method.time_deleted:
                raise ValidationError('Service method already exist')
            else:
                service_method.time_deleted = None
                service_method.save()
        except Service_method.DoesNotExist:
            service_method = serializer.save(service=service, method=method, service_device=service_device)
        return self.serializer_class(service_method).data


# возвращает список из информации по методу + по девайсу для pk_service
class DeviceMethodViewForService(APIView):
    permission_classes = [IsAuthenticated]

    # получение список из информации по методу + по девайсу (с учетом неудаленного service)
    def get(self, request, *args, **kwargs):
        service_methods = Service_method.objects.filter(service=self.kwargs.get('pk_service')).\
            filter(time_deleted__isnull=True)
        service_method_dict = []

        for service_method in service_methods:
            full_get_service = DeviceMethodGetForService(self.request.user)
            full_get_service.full_get_data(service_method.pk)

            service_method_dict = service_method_dict + [full_get_service.service_method_dict]
        return Response(service_method_dict)


# # получение девайсов по service и method
# class Service_method_deviceView(ListAPIView):
#     serializer_class = Service_deviceSerializer
#     permission_classes = [IsAuthenticated]
#
#     def get_queryset(self):
#
#         id_devices = Service_method.objects.filter(service=self.kwargs.get('pk_service')). \
#             filter(method=self.kwargs.get('pk_method')).values('service_device').filter(time_deleted__isnull=True)
#         return Service_device.objects.filter(id__in=id_devices).filter(time_deleted__isnull=True)


# # получение девайса по id
# class SingleService_deviceView(RetrieveAPIView):
#     serializer_class = Service_deviceSerializer
#     permission_classes = [IsAuthenticated]
#
#     def get_queryset(self):
#
#         id_devices = Service_method.objects.all().values('service_device').filter(time_deleted__isnull=True)
#         return Service_device.objects.filter(id__in=id_devices).filter(time_deleted__isnull=True)


class DestroyService_methodView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    # связанное удаление Service_method и девайса (если он связан только с одним Service_method)

    # функци получения объекта
    def get_obj(self, time_deleted):
        try:
            obj = Service_method.objects.get(time_deleted__isnull=time_deleted, id=self.kwargs.get('pk'))
        except ObjectDoesNotExist:
            raise Http404
        return obj

    def time_destroy(self, request, *args, **kwargs):
        time_deleted = True
        service_method = self.get_obj(time_deleted)
        service_device = service_method.service_device

        # del_perm(service_method)
        # data = self.perform_destroy(service_method)  # выполнение удаления
        # записывается дата удаления для объекта и всех связанных объектов
        delete_time(service_method)
        post_delete_time_children(service_method)

        if not Service_method.objects.filter(time_deleted__isnull=time_deleted).filter(
                service_device=service_method.service_device).exists():
            try:
                service_device = Service_device.objects.get(id=service_device.pk, time_deleted__isnull=time_deleted)

                # del_perm(service_method)

                # service_device.delete()  # выполнение удаления
                # записывается дата удаления для объекта и всех связанных объектов
                delete_time(service_device)
                post_delete_time_children(service_device)

            except Service_device.DoesNotExist:
                pass
        return Response(status=status.HTTP_204_NO_CONTENT)

    def full_destroy(self, request, *args, **kwargs):
        time_deleted = False
        service_method = self.get_obj(time_deleted)
        service_device = service_method.service_device

        del_perm(service_method)
        self.perform_destroy(service_method)  # выполнение удаления
        # записывается дата удаления для объекта и всех связанных объектов
        # delete_time(service_method)
        # post_delete_time_children(service_method)

        if not Service_method.objects.filter(time_deleted__isnull=time_deleted).filter(
                service_device=service_method.service_device).exists():
            try:
                service_device = Service_device.objects.get(id=service_device.pk, time_deleted__isnull=time_deleted)

                del_perm(service_method)

                service_device.delete()  # выполнение удаления
                # записывается дата удаления для объекта и всех связанных объектов
                # delete_time(service_device)
                # post_delete_time_children(service_device)

            except Service_device.DoesNotExist:
                pass
        return Response(status=status.HTTP_204_NO_CONTENT)



# возвращает всю информацию для pk_service: данные service, список методов в service,
# в каждом из которых список девайсов
class ServiceMethodDeviceViewForService(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        service = GetServiceMethodDeviceForService(self.request.user)
        response_data = service.data(self.kwargs.get('pk_service'))
        return Response(response_data)


# возвращает информацию по всем удаленным service_method: данные service, данные метода, данные девайса
class DeletedService_methodsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        services = Service.objects.all()
        service_method_dict = []
        for service in services:
            service_methods = Service_method.objects.filter(service=service.pk).filter(time_deleted__isnull=False)

            for service_method in service_methods:
                full_get_service = DeviceMethodGetForService(self.request.user)
                full_get_service.full_get_data(service_method.pk)

                service_method_element = full_get_service.service_method_dict
                service_method_element.update({"service_id": service.pk, "service_name": service.name,
                                               "service_short": service.short,
                                               "service_method_id": service_method.pk})
                service_method_element.update(get_time_before_del(service_method))
                service_method_dict = service_method_dict + [service_method_element]
        return Response(service_method_dict)


# восстановление удаленного Service
class RecoveryServiceMethodView(RetrieveUpdateAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = Service_methodSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = Service_method.objects.filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Service_method.objects.none()
        return queryset

    # восстановление - время в ноль
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        try:
            # Service.objects.get(id=instance.service.pk, time_deleted__isnull=True)
            recovery_object_and_children(instance)

            try:
                service_device = Service_device.objects.get(id=instance.service_device.pk, time_deleted__isnull=False)
                post_null_delete_time(service_device)

            except ObjectDoesNotExist:
                pass
            response_data = self.serializer_class(instance).data
        except ObjectDoesNotExist:
            response_data = "Service was deleted"
        return Response(response_data)


# получение всей возможной информации по отчету
class ServiceCompaniesView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            queryset = Service.objects.filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Service.objects.none()
        return queryset

    def get(self, *args, **kwargs):
        response_data = ServiceCompaniesFullGet(self.request.user).get_services_companies()
        return Response(response_data)

    def get_file(self, *args, **kwargs):
        response_data = ServiceCompaniesFullGet(self.request.user).get_services_companies()

        with open("files_root\\tools.json", "w", encoding='utf-8') as write_file:
            # write_file.write(str(response_data))
            json.dump(response_data, write_file)

        return Response({'file': f'http://10.23.125.176:5431/files/tools.json'})