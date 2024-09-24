from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from guardian.shortcuts import get_objects_for_user
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, RetrieveUpdateAPIView, \
    DestroyAPIView
from rest_framework.permissions import IsAuthenticated, DjangoObjectPermissions
from rest_framework.response import Response
from rest_framework.views import APIView

from authorization_for_check.service_logics import del_perm
from del_service.del_service_logic import delete_time, get_objs_time_del, post_delete_time, recovery_object_and_children
from .models import Service
from .serializers import ServiceSerializer


# возвращает список customer без учета удаленных / создает объект Service
class ServiceView(ListCreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = Service.objects.filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Service.objects.none()
        return queryset

    # дополняет метод создания
    def create(self, request, *args, **kwargs):
        try:
            service = Service.objects.get(name=request.data.get('name'), time_deleted__isnull=False)
            if service.time_deleted is not None:
                del_perm(service)
                service.delete()
        except ObjectDoesNotExist:
            pass
        return super().create(request, *args, **kwargs)

    # def perform_create(self, serializer):
    #     obj = serializer.save()
    #     return obj


# возвращает/удаляет/изменяет объект Service
class SingleServiceView(RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = Service.objects.filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Service.objects.none()
        return queryset

    # переопределение функции удаления объектов
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            # del_perm(instance)
            # self.perform_destroy(instance) # выполнение удаления
            # записывается дата удаления для объекта и всех связанных объектов
            delete_time(instance)
            post_delete_time(instance)
        except Http404:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)


# окончательное удаление
class DestroyServiceView(DestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = Service.objects.filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Service.objects.none()
        return queryset

    # переопределение функции удаления объектов: удаляются также всем возможные permissions
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        del_perm(instance)
        return super().destroy(request, *args, **kwargs)


# возвращает список удаленных Service
class DeletedServiceView(ListAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = ServiceSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = Service.objects.filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Service.objects.none()
        return queryset

    # переопределение функции, отвечающей на get-запрос, list_time - список времен до удаления объектов
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        response = get_objs_time_del(queryset, self.serializer_class)
        return Response(response)


# восстановление удаленного Service
class RecoveryServiceView(RetrieveUpdateAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = ServiceSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = Service.objects.filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Service.objects.none()
        return queryset

    # восстановление - время в ноль
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        recovery_object_and_children(instance)
        return Response(self.serializer_class(instance).data)


class StasticsViewQualityService(APIView):
    permission_classes = [IsAuthenticated]

    def inform_method(self, quality_control, services):
        inform_methods = get_objects_for_user(self.request.user, ['inform_for_method.view_inform_for_method'],
                                              accept_global_perms=False).filter(
            quality_control=quality_control.pk)
        for method in inform_methods:
            try:
                service = method.service_method.service
                if service.pk in services.keys():
                    services[service.pk]["values"].add(quality_control)
                else:
                    services[service.pk] = {"values": {quality_control}, "name": service.name,
                                            "short": service.short}
            except:
                pass
        return

    def get_services(self, quality_controls):
        services = {}
        for quality_control in quality_controls:
            if quality_control.value:
                self.inform_method(quality_control, services)
        return services

    def get_values(self, quality_controls):
        services = self.get_services(quality_controls)
        for key_service in services.keys():
            values = []
            for element in services[key_service]["values"]:
                # if not element.value:
                #     values.append(0)
                # else:
                values.append(element.value)
            services[key_service]["values"] = values
        return services

    def get_quality_services(self, quality_controls):
        quality_services = {}
        services = self.get_values(quality_controls)

        for key_service in services.keys():
            service_dict = services[key_service]
            main_value = round(sum(service_dict["values"]) / len(service_dict["values"]), 3)

            quality_services.update({key_service: {"name": service_dict["name"],
                                                   "short": service_dict["short"],
                                                   "value": main_value}})
        return quality_services

    def get(self, request, format=None):
        quality_controls = get_objects_for_user(request.user, ['quality_control.view_quality_control'],
                                                accept_global_perms=False).filter(time_deleted__isnull=True)

        return Response(self.get_response(self.get_quality_services(quality_controls)))

    def get_response(self, quality_services):
        response = []
        all_services = Service.objects.filter(time_deleted__isnull=True)

        for service in all_services:
            service_dict = {"id": service.pk}
            if service.pk in quality_services.keys():
                service_dict.update(quality_services[service.pk])
            else:
                service_dict.update({"name": service.name, "value": 0, "short": service.short})

            response.append(service_dict)

        return response


class ViewCountWellService(StasticsViewQualityService):
    permission_classes = [IsAuthenticated]

    def get_quality_services(self, quality_controls):
        quality_services = {}
        services = {}
        for quality_control in quality_controls:
            self.inform_method(quality_control, services)
        for key_service in services.keys():
            wells = set()
            service_dict = services[key_service]
            for quality_control in service_dict["values"]:
                try:
                    wells.add(quality_control.wellbore.well)
                except:
                    pass
            main_value = len(wells)
            quality_services.update({key_service: {"name": service_dict["name"], "value": main_value,
                                                   "short": service_dict["short"]}})
        return quality_services


class ViewPercWellService(ViewCountWellService):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        quality_controls = get_objects_for_user(request.user, ['quality_control.view_quality_control'],
                                                accept_global_perms=False).filter(time_deleted__isnull=True)

        response = self.get_response(self.get_quality_services(quality_controls))
        wells_count = 0
        for service in response:
            wells_count = wells_count + service["value"]

        wells_count = 1 if wells_count == 0 else wells_count
        for service in response:
            service["value"] = round(100 / wells_count * service["value"], 3)
        return Response(response)
