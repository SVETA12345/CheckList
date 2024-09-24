from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_objects_for_user, get_perms
from rest_framework.response import Response

from authorization_for_check.service_logics import send_all_permission
from service_companies.service_method.models import Service_method
from service_companies.service_method.service_logics import DeviceMethodGetForService
from .models import Inform_for_method, Koef_fail, Koef_shod
from .serializers import Koef_failSerializer, Koef_shodSerializer
from ..quality_control.models import Quality_control
from ..second_table.service_logic import SecondTableFullGetPost


# получение inform_for_methods для quality_control
class InformMethodFullGetServices:
    def __init__(self, user):
        self.exception = None
        self.service = {}
        self.methods_data = []
        self.second_tables = []
        self.user = user

    # возвращает информацию по inform_for_method / коэффициентам / второй таблице
    # / по методам/девайсам/сервисной компании
    def get_inform_for_method(self, pk):
        try:
            # inform_for_methods = Inform_for_method.objects.filter(quality_control=pk)
            inform_for_methods = get_objects_for_user(self.user, ['inform_for_method.view_inform_for_method'],
                                                      accept_global_perms=False).filter(quality_control=pk)
            for inform_for_method in inform_for_methods.order_by("id").values():
                if inform_for_method['quality_control_id'] is None:
                    self.exception = "Quality control Does Not Exist"
                    return
                if inform_for_method['service_method_id'] is None:
                    self.exception = "Service method Does Not Exist"
                    return

                koef_fail = self.koef_fail(inform_for_method['id'])
                if koef_fail:
                    inform_for_method.update(koef_fail)
                koef_shod = self.koef_shod(inform_for_method['id'])
                if koef_shod:
                    inform_for_method.update(koef_shod)
                service_methods_device = self.get_method_device(inform_for_method['service_method_id'])
                inform_for_method.update(service_methods_device)
                self.get_second_table(inform_for_method['id'], inform_for_method['method_value'], service_methods_device)

                [inform_for_method.pop(key, None) for key in ['quality_control_id', 'service_method_id']]
                self.methods_data = self.methods_data + [inform_for_method]
        except Inform_for_method.DoesNotExist:
            pass
        return

    # возвращает информацию по второй таблице
    def get_second_table(self, pk, method_value, service_methods_device):
        second_table = SecondTableFullGetPost(self.user)
        second_table.second_table(pk)
        data = second_table.data
        if len(data) != 0:
            data.update(service_methods_device)
            data.update({"method_value": method_value})
            # if second_table.exception is None:
            [data.pop(key, None) for key in ['tool_type', 'service_device_id']]
            self.second_tables = self.second_tables + [data]
        # else:
        #     self.exception = second_table.exception
        # return

    # возвращает информацию по koef_fail
    def koef_fail(self, pk):
        try:
            koef_fail = Koef_fail.objects.get(inform_for_method=pk)
            if self.user.has_perm('view_koef_fail', koef_fail):
                koef_fail_dict = Koef_failSerializer(koef_fail).data
                del koef_fail_dict['inform_for_method_id']
                return koef_fail_dict
            else:
                return {}
            # self.exception = "403"
        except Koef_fail.DoesNotExist:
            pass
        return

    # возвращает информацию по koef_shod
    def koef_shod(self, pk):
        try:
            koef_shod = Koef_shod.objects.get(inform_for_method=pk)
            if self.user.has_perm('view_koef_shod', koef_shod):
                koef_shod_dict = Koef_shodSerializer(koef_shod).data
                del koef_shod_dict['inform_for_method_id']
                return koef_shod_dict
            else:
                return {}
            # self.exception = "403"
        except Koef_shod.DoesNotExist:
            pass
        return

    # возвращает информацию по методам/девайсам/сервисной компании
    def get_method_device(self, pk):
        service_method = DeviceMethodGetForService(self.user)
        service_method.full_get_data(pk)
        # if service_method.exception is None:
        self.service.update(service_method.service)
        return service_method.service_method_dict
        # else:
        # self.exception = service_method.exception
        # return


# создает / обновляет информацию по inform_for_method
class InformMethodFullPostServices:
    def __init__(self, data, pk_quality_control, user):
        self.exception = None
        self.data = data
        self.fields = []
        self.changed = []
        self.quality_control_id = pk_quality_control
        self.user = user

    # создание / обновление информацию по koef_fail и koef_shod + установка permissions
    def koefs_of_inform_for_method(self, inform_for_method, koef_fail_value, koef_shod_value):
        if self.user.has_perm("inform_for_method.add_koef_fail"):
            koef_fail, created = Koef_fail.objects. \
                get_or_create(inform_for_method=inform_for_method)
            koef_fail.koef_fail = koef_fail_value
            koef_fail.save()
            send_all_permission(self.user, koef_fail, inform_for_method)
        if self.user.has_perm("inform_for_method.add_koef_shod"):
            koef_shod, created = Koef_shod.objects. \
                get_or_create(inform_for_method=inform_for_method)
            koef_shod.koef_shod = koef_shod_value
            koef_shod.save()

            send_all_permission(self.user, koef_shod, inform_for_method)
        return

    # формирует набор полей объекта Inform_for_method
    def fields_create(self):
        for value in Inform_for_method._meta.get_fields():
            self.fields = self.fields + [value.name]

    # изменение по набору полей / создание Inform_for_method
    def create_update_inform_for_method(self, inform_for_method_dict, service_method):
        try:
            quality_control = Quality_control.objects.get(id=self.quality_control_id)
            inform_for_method_id = inform_for_method_dict['id']
            del inform_for_method_dict['id']
            self.fields_create()
            try:
                inform_for_method = Inform_for_method.objects.get(id=inform_for_method_id,
                                                                  quality_control=quality_control)
                if self.user.has_perm("change_inform_for_method", inform_for_method):
                    inform_for_method.service_method = service_method
                    for key, value in iter(inform_for_method_dict.items()):
                        setattr(inform_for_method, key, value)
                    inform_for_method.save()
            except Inform_for_method.DoesNotExist:
                if self.user.has_perm("inform_for_method.add_inform_for_method"):
                    try:
                        inform_for_method = Inform_for_method.objects.get(quality_control=quality_control,
                                                                          service_method=service_method,
                                                                          **{key: value for key, value in
                                                                             iter(inform_for_method_dict.items())
                                                                             if key in self.fields})
                        if 'view_inform_for_method' not in get_perms(self.user, inform_for_method):
                            raise ObjectDoesNotExist
                    except ObjectDoesNotExist:
                        inform_for_method = Inform_for_method.objects.create(quality_control=quality_control,
                                                                             service_method=service_method,
                                                                             **{key: value for key, value in
                                                                                iter(inform_for_method_dict.items())
                                                                                if key in self.fields})
                        send_all_permission(self.user, inform_for_method, quality_control)
                else:
                    raise Exception("You don't get satisfaction")
            # self.data.get('second_table')
            return inform_for_method
        except Quality_control.DoesNotExist:
            self.exception = 'Quality control does not exist'
            return

    # получение объекта service_method по заданным service, device, methods
    def get_service_method(self, inform_for_method_dict, service):
        full_post_service = DeviceMethodGetForService(self.user)

        method = full_post_service.method(inform_for_method_dict['method_id'])
        if not method:
            return
        device = full_post_service.device(inform_for_method_dict['service_device_id'])
        if not device:
            return

        service_method = Service_method.objects.filter(method=method).filter(service_device=device). \
            filter(service=service).first()
        return service_method

    # создание inform_for_method и second_table
    def create_update_inf_meth_sec_tab(self, inform_for_method_dict, service):
        service_method = self.get_service_method(inform_for_method_dict, service)
        inform_for_method_id = inform_for_method_dict['id']
        if service_method:
            inform_for_method = self.create_update_inform_for_method(inform_for_method_dict, service_method)
            if inform_for_method:
                self.koefs_of_inform_for_method(inform_for_method, inform_for_method_dict["koef_fail"],
                                                inform_for_method_dict["koef_shod"])
                second_table_service = SecondTableFullGetPost(self.user)
                second_table_service.post_second_table(inform_for_method, inform_for_method_id, self.data[2])
            else:
                self.exception = "Inform for method does not created"
        else:
            self.exception = "Service method does not exist"

    # получение информации по service/методам/приборам и создание необходимых объектов inform_for_method + связанные
    def create_update(self):
        inform_for_methods = self.data[1]  # self.data.get('inform_for_method')
        full_post_service = DeviceMethodGetForService(self.user)

        service = full_post_service.get_service(self.data[0])  # self.data.get('service_id')
        if not service:
            return

        for inform_for_method_dict in inform_for_methods:
            self.changed = self.changed + [inform_for_method_dict['id']]
            self.create_update_inf_meth_sec_tab(inform_for_method_dict, service)

        if self.exception is None:
            return Response('OK', content_type='text/html', status=200)
        else:
            return Response(f'{self.exception}', content_type='text/html', status=500)
