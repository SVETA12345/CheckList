from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_user_perms, get_perms
from rest_framework.exceptions import PermissionDenied
from authorization_for_check.service_logics import send_all_permission
from customer_companies.clusters.service_logics import ClusterFullGet
from customer_companies.customers.service_logics import CustomerFullGet
from customer_companies.fields.service_logics import FieldFullGet
from customer_companies.wellbores.models import Wellbore
from customer_companies.wellbores.service_logics import WellboreFullGet
from customer_companies.wells.service_logics import WellFullGet
from .manager import Types_data
from .models import Quality_control
from .serializers import Quality_controlSerializer
from ..digital_data.service_logics import Digital_dataFullGetPost
from ..full_inform.service_logics import Full_informFullGetPost
from ..inform_for_method.service_logics import InformMethodFullGetServices, InformMethodFullPostServices
from ..las_file.service_logics import Las_fileFullGetPost
from ..witsml.service_logics import WitsmlFullGetPost
from service_companies.services.models import Service as s_company


# получение всех данных по отчету
class FullGet:
    def __init__(self, user):
        self.exception = None
        self.data = {}
        self.user = user

    # получение информации по отчету
    def quality_control(self, pk):
        try:
            quality_control = Quality_control.objects.get(id=pk, time_deleted__isnull=True)
            if self.user.has_perm('view_quality_control', quality_control):
                quality_control_dict = Quality_controlSerializer(quality_control).data
                self.data.update(quality_control_dict)
                self.data["density"] = {"density": quality_control_dict["density"]}
                # print(self.data["density"])
                if quality_control.wellbore is None:
                    self.exception = "Wellbore Does Not Exist"
                    return
                self.wellbore(quality_control.wellbore.pk)
                self.full_inform(pk)
                # self.las_file(pk)
                # self.witsml(pk)
                self.digital_data(pk)
                self.inform_for_method(pk)
                # сервисная компания
                if quality_control.service_company:
                    self.data.update({"service_name": quality_control.service_company.name,
                                      "service_short": quality_control.service_company.short,
                                      "service_id": quality_control.service_company.id})
        except Quality_control.DoesNotExist:
            self.exception = "Quality control Does Not Exist"
        return

    # получение информации по wellbore
    def wellbore(self, pk_wellbore):
        wellbore = WellboreFullGet(self.user)
        wellbore.wellbore(pk_wellbore)
        if wellbore.exception is None:
            self.data.update(wellbore.data)
            self.well(wellbore.well)
        else:
            self.exception = wellbore.exception
        return

    # получение информации по well
    def well(self, pk_well):
        well = WellFullGet(self.user)
        well.well(pk_well)
        if well.exception is None:
            self.data.update(well.data)
            self.cluster(well.cluster)
        else:
            self.exception = well.exception
        return

    # получение информации по cluster
    def cluster(self, pk_cluster):
        cluster = ClusterFullGet(self.user)
        cluster.cluster(pk_cluster)
        if cluster.exception is None:
            self.data.update(cluster.data)
            self.field(cluster.field)
        else:
            self.exception = cluster.exception
        return

    # получение информации по field
    def field(self, pk_field):
        field = FieldFullGet(self.user)
        field.field(pk_field)
        if field.exception is None:
            self.data.update(field.data)
            self.customer(field.customer)
        else:
            self.exception = field.exception
        return

    # получение информации по customer
    def customer(self, pk_customer):
        customer = CustomerFullGet(self.user)
        customer.customer(pk_customer)
        if customer.exception is None:
            self.data.update(customer.data)
        else:
            self.exception = customer.exception
        return

    # получение информации по full_inform
    def full_inform(self, pk):
        full_inform = Full_informFullGetPost(self.user)
        full_inform.full_inform(pk)
        if full_inform.exception is None:
            self.data.update(full_inform.data)
        else:
            self.exception = full_inform.exception
        return

    # # получение информации по las_file
    # def las_file(self, pk):
    #     las_file = Las_fileFullGetPost(self.user)
    #     las_file.las_file(pk)
    #     if las_file.exception is None:
    #         self.data.update(las_file.data)
    #     else:
    #         self.exception = las_file.exception
    #     return

    # получение информации по digital_data
    def digital_data(self, pk):
        digital_data = Digital_dataFullGetPost(self.user)
        digital_data.digital_data(pk)
        if digital_data.exception is None:
            self.data.update(digital_data.data)
        else:
            self.exception = digital_data.exception
        return

    # получение информации по witsml
    # def witsml(self, pk):
    #     witsml = WitsmlFullGetPost(self.user)
    #     witsml.witsml(pk)
    #     if witsml.exception is None:
    #         self.data.update(witsml.data)
    #     else:
    #         self.exception = witsml.exception
    #     return

    # получение информации по inform_for_method
    def inform_for_method(self, pk):
        inform_service = InformMethodFullGetServices(self.user)
        inform_service.get_inform_for_method(pk)
        if inform_service.exception is None:
            self.data.update({"inform_for_method": inform_service.methods_data})
            self.data.update({"second_table": inform_service.second_tables})
            self.data.update(inform_service.service)
        else:
            self.exception = inform_service.exception
        return

    # получение всех данных
    def get_data(self, pk):
        if self.exception is None:
            self.quality_control(pk)
            return self.data
        else:
            return self.exception


# создание отчета + всех связанных данных
class FullPostServices:
    def __init__(self, data, user):
        self.exception = None
        self.data = data
        self.user = user
        self.fields = []
        self.quality_control = None

    # def wellbore(self):
    #     # data = [self.data.get('field'), self.data.get('num_pad'), self.data.get('num_well'), self.data.get('well_type'),
    #     #         self.data.get('num_wellbore'), self.data.get('pie_well'),
    #     #         self.data.get('diametr')]
    #     id_wellbore = self.data.get('id_wellbore')
    #     try:
    #         wellbore = Wellbore.objects.get(id=id_wellbore)
    #         return wellbore
    #     except Wellbore.DoesNotExist:
    #         return

    # wellbore_service = WellboreFullPostServices(data, self.user)
    # wellbore = wellbore_service.wellbore()
    # if wellbore_service.exception is None and wellbore is not None:
    #     return wellbore
    # else:
    #     self.exception = wellbore_service.exception
    #     return

    # создание full_inform
    def full_inform(self):
        full_inform_service = Full_informFullGetPost(self.user)
        full_inform_service.post_full_inform(self.data.get('full_inform'), self.quality_control.pk)
        if full_inform_service.exception is not None:
            self.exception = full_inform_service.exception
        return

    # создание witsml
    def witsml(self):
        witsml_service = WitsmlFullGetPost(self.user)
        witsml_service.post_witsml(self.data.get('witsml'), self.quality_control.pk)
        if witsml_service.exception is not None:
            self.exception = witsml_service.exception
        return

    # создание las_file
    def las_file(self):
        las_file_service = Las_fileFullGetPost(self.user)
        las_file_service.post_las_file(self.data.get('las_file'), self.quality_control.pk)
        if las_file_service.exception is not None:
            self.exception = las_file_service.exception
        return

    # создание digital_data
    def digital_data(self):
        digital_data_service = Digital_dataFullGetPost(self.user)
        digital_data_service.post_digital_data(self.data.get('digital_data'), self.quality_control.pk)
        if digital_data_service.exception is not None:
            self.exception = digital_data_service.exception
        return

    def create_quality_control(self, wellbore):
        """Создание самого отчета + установка permissions"""
        if self.user.has_perm("quality_control.add_quality_control"):
            quality_control_data = {"wellbore": wellbore,
                                    "density": self.data.get('density')['density'],
                                    "value": self.data.get('value'),
                                    "data_type": self.data.get('data_type'),
                                    "note": self.data.get('note'),
                                    "section_interval_end": self.data.get('section_interval_end'),
                                    "start_date": self.data.get('start_date'),
                                    "end_date": self.data.get('end_date'),
                                    "section_interval_start": self.data.get('section_interval_start'),
                                    "time_deleted": None,
                                    "accompaniment_type": self.data.get('accompaniment_type'),
                                    "complex_definition": self.data.get("complex_definition"),
                                    "service_company": s_company.objects.get(id=self.data.get('service_id'))}
            try:
                quality_control = Quality_control.objects.get(**quality_control_data)
                if 'view_quality_control' not in get_perms(self.user, quality_control):
                    raise ObjectDoesNotExist
            except ObjectDoesNotExist:
                quality_control = Quality_control.objects.create(author=f"{self.user.first_name} {self.user.last_name}",
                                                                 **quality_control_data)
                send_all_permission(self.user, quality_control, wellbore)
            return quality_control
        return

    def post_quality_control(self):
        """Получение wellbore и создание с его id отчета"""
        try:
            wellbore = Wellbore.objects.get(id=self.data.get('id_wellbore'))
            if self.data.get('data_type') != Types_data.From_device_memory \
                    or not Quality_control.objects_for_checks.check_created_final_quality(wellbore.pk):
                quality_control = self.create_quality_control(wellbore)
                if quality_control is not None:
                    return quality_control.pk
                else:
                    raise PermissionDenied('You do not have permission to perform this action.')
            else:
                self.exception = 'Final quality control already exist'
                return None
        except Wellbore.DoesNotExist:
            self.exception = 'Wellbore does not exist'
            return None

    def post_data(self):
        """Создание отчета и всех данных на его основе"""
        quality_control_id = self.post_quality_control()
        if quality_control_id:
            self.quality_control = Quality_control.objects.get(id=quality_control_id)
            self.full_inform()
            # self.witsml()
            # self.las_file()
            self.digital_data()
            data = [self.data.get('service_id'), self.data.get('inform_for_method'), self.data.get('second_table')]
            inform_for_method_service = InformMethodFullPostServices(data, self.quality_control.pk, self.user)
            inform_for_method_service.create_update()
            if inform_for_method_service.exception is not None:
                self.exception = inform_for_method_service.exception

        if self.exception is None:
            return {"quality_control_pk": self.quality_control.pk}
        else:
            return self.exception
