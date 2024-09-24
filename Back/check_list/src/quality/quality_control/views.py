import os

from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404, FileResponse, HttpResponse
from guardian.shortcuts import get_objects_for_user
from rest_framework import status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, get_object_or_404, \
    RetrieveUpdateAPIView, DestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, DjangoObjectPermissions
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN
from rest_framework.views import APIView
from authorization_for_check.service_logics import send_all_permission, del_perm
from customer_companies.clusters.models import Cluster
from customer_companies.customers.models import Customer
from customer_companies.fields.models import Field
from customer_companies.wellbores.models import Wellbore
from del_service.del_service_logic import delete_time, post_delete_time, recovery_object_and_children, \
    get_time_before_del
from .load import save_xlsx, save_pdf
from .models import Quality_control, Sample
from .serializers import Quality_controlSerializer, SampleSerializer
from .service_logic import FullGet, FullPostServices
from rest_framework import parsers

from service_companies.services.models import Service as s_company
from service_companies.service_method.models import Service_method

from ..second_table.models import Second_table



class SampleView(ListCreateAPIView):
    serializer_class = SampleSerializer
    parser_classes = (parsers.MultiPartParser, parsers.JSONParser)
    permission_classes = [IsAuthenticated]
    queryset = Sample.objects.all()


class SingleStrataView(RetrieveAPIView):
    serializer_class = SampleSerializer
    parser_classes = (parsers.MultiPartParser, parsers.JSONParser)
    permission_classes = [IsAuthenticated]
    queryset = Sample.objects.all()

    def get_object(self):
        return Sample.objects.last()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance:
            response = self.get_serializer(instance).data
        else:
            response = {"message": "There is no template"}
        return Response(response)


# создает/ возвращает list
class Quality_controlView(ListCreateAPIView):
    serializer_class = Quality_controlSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # выполнение создания + установка permissions
    def perform_create(self, serializer):
        try:
            wellbore = Wellbore.objects.get(id=self.request.data.get('wellbore_id'))
        except Wellbore.DoesNotExist:
            wellbore = get_object_or_404(Wellbore, id=self.kwargs.get('pk_wellbore'))
        if self.request.user.has_perm('add_wellbore', wellbore):
            quality_control = serializer.save(wellbore=wellbore)
            send_all_permission(self.request.user, quality_control, wellbore)
            return quality_control
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['quality_control.view_quality_control'],
                                            accept_global_perms=False). \
                filter(wellbore=self.kwargs.get('pk_wellbore')).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Quality_control.objects.none()
        return queryset


# возвращает/удаляет/изменяет объект Quality_control
class SingleQuality_controlView(RetrieveUpdateDestroyAPIView):
    serializer_class = Quality_controlSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['quality_control.view_quality_control'],
                                            accept_global_perms=False).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Quality_control.objects.none()
        return queryset

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

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
class DestroyQualityView(DestroyAPIView):
    serializer_class = Quality_controlSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['quality_control.view_quality_control'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Quality_control.objects.none()
        return queryset

    # переопределение функции удаления объектов: удаляются также всем возможные permissions
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        del_perm(instance)
        return super().destroy(request, *args, **kwargs)


# получение всей возможной информации по отчету
class FullGetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, *args, **kwargs):
        response_data = FullGet(self.request.user).get_data(self.kwargs.get('pk'))
        if response_data == '403':
            return Response('You do not have permission to perform this action.', status=HTTP_403_FORBIDDEN)
        else:
            return Response(response_data)


# сохранение файлов
class ViewSaveFile(viewsets.ModelViewSet):
    report_path = os.getcwd() + f'/check_list/src/files_root/report_file/'
    permission_classes = [IsAuthenticated]

    # получение информации об отчете и сохранение ее в файл
    def get_file(self, func, format):
        pk = self.kwargs.get('pk')
        response_data = FullGet(self.request.user).get_data(pk)  # получаем данные, которые в дальнейшем запишем
        if response_data == '403':
            return Response('You do not have permission to perform this action.', status=HTTP_403_FORBIDDEN)
        else:
            try:
                self.queryset = get_objects_for_user(self.request.user, ['quality_control.view_quality_control'],
                                                     accept_global_perms=False).filter(id=pk, time_deleted__isnull=True)
                creater = f'{self.request.user.first_name} {self.request.user.last_name}'
                Quality_control.objects.get(id=pk, time_deleted__isnull=True)
                name_file = func(response_data, pk, creater)
                if name_file == 'Error: Нет доступных шаблонов отчёта':
                    return Response(name_file)
                else:
                    return FileResponse(open(self.report_path + name_file+format, 'rb'), filename=name_file)

            except ObjectDoesNotExist:
                return Response('Quality control does not exist')

    # сохранение файла pdf
    def get_pdf(self, request, *args, **kwargs):
        return self.get_file(save_pdf, '.pdf')

    # сохранение файла xlsx
    def get_xlsx(self, request, *args, **kwargs):
        return self.get_file(save_xlsx, '.xlsx')


# получение всех отчетов
class AllQuality_controlView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    # получение всех отчетов
    def get_all_quality(self, time_deleted):
        data = []
        try:
            self.queryset = get_objects_for_user(self.request.user, ['quality_control.view_quality_control'],
                                                 accept_global_perms=False).filter(time_deleted__isnull=time_deleted)
            # quality_controls = Quality_control.objects.all()
            for quality_control in self.queryset:
                quality_control_dict = {}
                if quality_control.wellbore is not None and quality_control.wellbore.well is not None:
                    wellbore = quality_control.wellbore
                    well = wellbore.well
                    quality_control_dict.update({'quality_control_id': quality_control.pk,
                                                 'data_of_created': quality_control.data_of_created,
                                                 'value': quality_control.value,
                                                 'note': quality_control.note,
                                                 'author': quality_control.author,
                                                 'start_date': quality_control.start_date,
                                                 'end_date': quality_control.end_date,
                                                 # 'column_shoe': quality_control.column_shoe,
                                                 'well': well.num_well,
                                                 'section_interval_start': quality_control.section_interval_start,
                                                 'pie_well': wellbore.pie_well,
                                                 'num_wellbore': wellbore.num_wellbore,
                                                 'section_interval_end': quality_control.section_interval_end,
                                                 'data_type': quality_control.data_type})
                    if self.request.user.has_perm('view_wellbore', wellbore) \
                            and self.request.user.has_perm('view_well', well):
                        quality_control_dict.update({'well': well.num_well})
                        cluster = Cluster.objects.get(id=well.cluster.pk)
                        field = Field.objects.get(id=cluster.field.pk)
                        customer = Customer.objects.get(id=field.customer.pk)
                        quality_control_dict.update(
                            {'cluster': cluster.name, 'field': field.name, 'customer': customer.name,
                             'short_customer': customer.short})
                        if not time_deleted:
                            quality_control_dict.update(get_time_before_del(quality_control))
                        data = data + [quality_control_dict]
            return Response(data)
        except ObjectDoesNotExist:
            return Response('You do not have permission to perform this action.', status=HTTP_403_FORBIDDEN)

    # получение удаленных отчетов
    def del_get(self, request):
        return self.get_all_quality(False)

    # получение не удаленных отчетов
    def not_del_get(self, request):
        return self.get_all_quality(True)


class FullPostView(APIView):
    """Создание отчёта"""
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        """Обновление данных отчёта"""
        data = self.request.data
        if data.get('quality_control_id'):
            wellbore = Wellbore.objects.get(id=data.get('id_wellbore'))
            quality_object = Quality_control.objects.get(id=data.get('quality_control_id'))

            # Обновление основной информации
            Quality_control.objects.filter(id=data.get('quality_control_id')).update(
                wellbore=wellbore,
                density=data.get('density')['density'],
                value=data.get('value'),
                data_type=data.get('data_type'),
                note=data.get('note'),
                section_interval_end=data.get('section_interval_end'),
                start_date=data.get('start_date'),
                end_date=data.get('end_date'),
                section_interval_start=data.get('section_interval_start'),
                accompaniment_type=data.get('accompaniment_type'),
                complex_definition=data.get("complex_definition"),
                service_company=s_company.objects.get(id=data.get('service_id')))
            # Обновление цифровых данных
            digital_data = data.get("digital_data")
            digital_obj = quality_object.digital_data_set
            if digital_data:
                digital_obj.quality_control = quality_object
                digital_obj.wellLas = digital_data.get('wellLas')
                digital_obj.parameteresLas = digital_data.get('parameteresLas')
                digital_obj.curveLas = digital_data.get('curveLas')
                digital_obj.log_dataLas = digital_data.get('log_dataLas')
                digital_obj.wellWitsml = digital_data.get('wellWitsml')
                digital_obj.parameteresWitsml = digital_data.get('parameteresWitsml')
                digital_obj.curveWitsml = digital_data.get('curveWitsml')
                digital_obj.log_dataWitsml = digital_data.get('log_dataWitsml')
                digital_obj.digital_count = digital_data.get('digital_count')
                digital_obj.type = digital_data.get('type')
                digital_obj.save()
            # Обновление полноты представления данных
            fi_data = data.get("full_inform")
            fi_obj = quality_object.full_inform_set
            if fi_data:
                fi_obj.act = fi_data.get('act')
                fi_obj.titul_list = fi_data.get('titul_list')
                fi_obj.well_construction = fi_data.get('well_construction')
                fi_obj.wellbore_sizes = fi_data.get('wellbore_sizes')
                fi_obj.chrono_data = fi_data.get('chrono_data')
                fi_obj.sol_data = fi_data.get('sol_data')
                fi_obj.dash_comp = fi_data.get('dash_comp')
                fi_obj.summary_data = fi_data.get('summary_data')
                fi_obj.inklino_data = fi_data.get('inklino_data')
                fi_obj.main_record = fi_data.get('main_record')
                fi_obj.parametr = fi_data.get('parametr')
                fi_obj.control_record = fi_data.get('control_record')
                fi_obj.lqc = fi_data.get('lqc')
                fi_obj.calibration = fi_data.get('calibration')
                fi_obj.full_inf_count = fi_data.get('full_inf_count')
                fi_obj.save()
            # Обновление информации по методам
            methods_data = data.get("inform_for_method")
            methods_data2 = data.get("second_table")

            method_obj = quality_object.quality_control_set
            for m in method_obj.all().filter(quality_control_id=data.get('quality_control_id')):
                m.delete()

            if methods_data:
                for index, item in enumerate(methods_data):
                    # print(index, item)
                    new_method = method_obj.create(quality_control_id=data.get('quality_control_id'),
                                                   service_method=Service_method.objects.get(
                                                       service_device_id=item.get('service_device_id'),
                                                       method_id=item.get('method_id'),
                                                   ),
                                                   tool_num=item.get('tool_num'),
                                                   calibr_date=item.get('calibr_date'),
                                                   interval_shod_start=item.get('interval_shod_start'),
                                                   interval_shod_end=item.get('interval_shod_end'),
                                                   reason_rashod=item.get('reason_rashod'),
                                                   petrophysic_task=item.get('petrophysic_task'),
                                                   petrophysic_selected=list(item.get('petrophysic_selected')),
                                                   method_value=item.get('method_value'), )
                    Second_table.objects.create(
                        inform_for_method=new_method,
                        linkage=methods_data2[index].get('linkage'),
                        emissions=methods_data2[index].get('emissions'),
                        noise=methods_data2[index].get('noise'),
                        control=methods_data2[index].get('control'),
                        distribute_support=methods_data2[index].get('distribute_palet'),
                        distribute_palet=methods_data2[index].get('distribute_support'),
                        dash=methods_data2[index].get('dash'),
                        corresponse=methods_data2[index].get('device_tech_condition'),
                        correlation=methods_data2[index].get('corresponse'),
                        device_tech_condition=methods_data2[index].get('correlation'),
                        notes=methods_data2[index].get('notes'),
                    )
        return Response({'detail': "ok"})

    def post(self, request, *args, **kwargs):
        print('req=', request.body)
        return Response(FullPostServices(self.request.data, self.request.user).post_data())


# восстановление удаленного отчета
class RecoveryQualityView(RetrieveUpdateAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = Quality_controlSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['quality_control.view_quality_control'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Quality_control.objects.none()
        return queryset

    # восстановление - время в ноль
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            Wellbore.objects.get(id=instance.wellbore.pk, time_deleted__isnull=True)
            recovery_object_and_children(instance)
            response_data = self.serializer_class(instance).data
        except ObjectDoesNotExist:
            response_data = "Quality was deleted"
        return Response(response_data)
