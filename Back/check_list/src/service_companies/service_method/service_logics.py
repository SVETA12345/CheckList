from django.core.exceptions import ObjectDoesNotExist

from service_companies.method_class.models import Method_class
from service_companies.methods.models import Method
from service_companies.methods.serializers import MethodSerializer
from service_companies.service_method.models import Service_device, Service_method
from service_companies.service_method.serializers import Service_methodSerializer, Service_deviceSerializer
from service_companies.services.models import Service
from service_companies.services.serializers import ServiceSerializer


# класс для возврата всей информации для pk_service: данные service, список методов в service,
# в каждом из которых список девайсов
class GetServiceMethodDeviceForService:
    def __init__(self, user):
        self.user = user
        self.exception = None

    # возвращает список devices по pk_service и pk_method
    def service_device(self, pk_method, pk_service):
        service_device_value = Service_method.objects_service.filter_for_device(pk_service, pk_method)
        service_devices = Service_device.objects.filter(id__in=service_device_value). \
            filter(time_deleted__isnull=True).values()
        service_devices_list = []
        for service_device in service_devices:
            try:
                service_device["id_service_method"] = Service_method.objects.get(service=pk_service, method=pk_method,
                                                                                 service_device=service_device["id"],
                                                                                 time_deleted__isnull=True).id
                service_devices_list = service_devices_list + [service_device]
            except ObjectDoesNotExist:
                pass
        return service_devices_list

    # возвращает список methods со списком devices по pk_service
    def method_device(self, pk_service):
        methods_value = Service_method.objects_service.filter_for_method(pk_service)
        methods = Method.objects.filter(id__in=methods_value)
        method_device = []
        for method in methods.values():
            method['device'] = self.service_device(method['id'], pk_service)
            try:
                method_class = Method_class.objects.get(id=method["method_class_id"])
                method['method_class_name'] = method_class.name
            except Method_class.DoesNotExist:
                method['method_class_name'] = None
            method_device = method_device + [method]
        return method_device

    # возвращает все данные по pk service
    def data(self, pk):
        data = {}
        try:
            service = Service.objects.get(id=pk, time_deleted__isnull=True)
            service_dict = ServiceSerializer(service).data
            service_dict['method'] = self.method_device(service_dict['id'])
            data.update(service_dict)
        except Service.DoesNotExist:
            data.update({'response': 'Service Does Not Exist'})
        return data


class ServiceCompaniesFullGet:
    def __init__(self, user):
        self.user = user
        self.response = []

    def get_services_companies(self):
        try:
            services = Service.objects.filter(time_deleted__isnull=True)

            for service in services:
                self.response = self.response + [self.get_service(service)]

        except ObjectDoesNotExist:
            self.response = Service.objects.none()
        return self.response

    def get_service(self, service):
        service_dict = {"name": ServiceSerializer(service).data["name"]}
        service_dict.update(self.get_methods_devices(service))

        return service_dict

    def get_methods_devices(self, service):
        method_device = {}
        try:
            methods_value = Service_method.objects_service.filter_for_method(service.pk)
            methods = Method.objects.filter(id__in=methods_value)
            method_device['methods'] = self.get_list_fields(methods, service.pk)

        except ObjectDoesNotExist:
            method_device['methods'] = Method.objects.none()
        return method_device

    def get_list_fields(self, methods, service_pk):
        method_list = []
        # for field in fields:
        #     field_list = field_list + [self.get_field(field)]

        for method in methods:
            method_list = method_list + [self.get_method(method, service_pk)]

        return method_list

    def get_method(self, method, service_pk):
        method_dict = {"name": MethodSerializer(method).data["name"]}
        method_dict.update(self.get_service_device(method, service_pk))

        return method_dict

    def get_service_device(self, method_pk, service_pk):

        service_device = {}
        try:
            service_device_value = Service_method.objects_service.filter_for_device(service_pk, method_pk)
            service_devices = Service_device.objects.filter(id__in=service_device_value). \
                filter(time_deleted__isnull=True).values()
            service_device['devices'] = self.get_devices_list(service_devices)

        except ObjectDoesNotExist:
            service_device['devices'] = Service_device.objects.none()
        return service_device

    def get_devices_list(self, service_devices):
        service_devices_list = []
        for service_device in service_devices:
            service_devices_list = service_devices_list + \
                                   [{"name": Service_deviceSerializer(service_device).data["tool_type"]}]
        return service_devices_list


# класс для записи в service_method_dict информации метода и девайса и в service информации о service
class DeviceMethodGetForService:
    def __init__(self, user):
        # self.exception = None
        self.service_method_dict = {}
        self.service = {}
        # self.time_deleted__isnull = time_deleted__isnull
        self.user = user

    # записывает для service_method по его pk информацию из метода + из девайса в service_method_dict
    # и в service информации о service
    def full_get_data(self, pk):
        try:
            service_method = Service_method.objects.get(id=pk)
            service_method_dict = Service_methodSerializer(service_method).data

            if self.service_data_for_full_get(service_method_dict['service_id']):
                if self.device_data_for_full_get(service_method_dict['service_device_id']):
                    self.method_data_for_full_get(service_method_dict['method_id'])

        except Service_method.DoesNotExist:
            pass
            # self.exception = "Service method Does Not Exist"
        return

    # записывает в service информацию о service
    def service_data_for_full_get(self, id_service):
        service = self.get_service(id_service)
        if service:
            self.service.update({'service_name': service.name,
                                 'service_short': service.short,
                                 'service_id': service.pk})
            return service
        return

    # записывает в service_method_dict информацию о service_device
    def device_data_for_full_get(self, id_device):
        service_device = self.device(id_device)
        if service_device:
            self.service_method_dict.update({'tool_type': service_device.tool_type,
                                             'service_device_id': service_device.pk})
            return service_device
        return

    # записывает в service_method_dict информацию о method
    def method_data_for_full_get(self, id_method):
        method = self.method(id_method)
        if method:
            self.service_method_dict.update({'method': method.name, 'method_id': method.pk})
            return method
        return

    # def check_time_deleted(self, object):
    #     return object.time_deleted is not None

    # получение service
    def get_service(self, pk):
        try:
            service = Service.objects.get(id=pk)
            # if self.check_time_deleted(service):
            #     self.exception = 'Service was deleted'
            #     return
            return service
        except Service.DoesNotExist:
            pass
            # self.exception = 'Service Does Not Exist'
            return

    # получение method
    def method(self, pk):
        try:
            method = Method.objects.get(id=pk)
            return method
        except Method.DoesNotExist:
            pass
            # self.exception = 'Method Does Not Exist'
            return

    # получение device
    def device(self, pk):
        try:
            service_device = Service_device.objects.get(id=pk)
            # if self.check_time_deleted(service_device):
            #     self.exception = 'Service device was deleted'
            #     return
            return service_device
        except Service_device.DoesNotExist:
            pass
            # self.exception = 'Service device Does Not Exist'
            return

# def check_service_device(deleted_obj, func):
#     if deleted_obj._meta.model_name == "service_method":
#         if not Service_method.objects.filter(time_deleted__isnull=True).filter(
#                 service_device=deleted_obj.service_device).exists():
#             try:
#                 service_device = Service_device.objects.get(id=deleted_obj.service_device.pk)
#
#                 # del_perm(service_method)
#                 # service_device.delete()  # выполнение удаления
#                 # записывается дата удаления для объекта и всех связанных объектов
#
#                 func(service_device, deleted_obj)
#             except Service_device.DoesNotExist:
#                 pass
#
#
# def del_device_with_serv_method(deleted_obj):
#     check_service_device(deleted_obj, delete_time_children)
#
#
# def recovery_device_with_serv_method(deleted_obj):
#     check_service_device(deleted_obj, check_deleted_time)
