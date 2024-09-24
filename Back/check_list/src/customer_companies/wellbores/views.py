from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.db.models import ForeignKey, ForeignObjectRel
from django.db.models.deletion import Collector
from django.http import Http404
from guardian.shortcuts import get_objects_for_user
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, get_object_or_404, ListAPIView, \
    RetrieveUpdateAPIView, DestroyAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated
from rest_framework.response import Response
from authorization_for_check.service_logics import send_all_permission, del_perm
from del_service.del_service_logic import get_objs_time_del, recovery_object_and_children, post_delete_time
from service_companies.service_method.models import Service_device
from ..wells.models import Well
from .serializers import WellboreSerializer
from .models import Wellbore

# возвращает список wellbore без учета удаленных / создает объект wellbore
from ..wells.serializers import WellSerializer


class WellboreView(ListCreateAPIView):
    serializer_class = WellboreSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            wellbore = Wellbore.objects.get(num_wellbore=request.data.get('num_wellbore'),
                                            well=self.kwargs.get('pk_well'),
                                            pie_well=request.data.get('pie_well'))
            if wellbore.time_deleted is not None:
                del_perm(wellbore)
                wellbore.delete()
            else:
                return Response(self.serializer_class(wellbore).data)
        except ObjectDoesNotExist:
            pass
        except MultipleObjectsReturned:
            wellbores = Wellbore.objects.filter(num_wellbore=request.data.get('num_wellbore'),
                                                well=self.kwargs.get('pk_well'),
                                                pie_well=request.data.get('pie_well'))
            wellbores.delete()
        return super().create(request, *args, **kwargs)

    # переопределение функции выполнения создания объекта (устанавливаются permissions)
    def perform_create(self, serializer):
        try:
            well = Well.objects.get(id=self.request.data.get('well_id'))
        except Well.DoesNotExist:
            well = get_object_or_404(Well, id=self.kwargs.get('pk_well'))

        if self.request.user.has_perm("wells.add_well"):

            wellbore = serializer.save(well=well)

            send_all_permission(self.request.user, wellbore, well)

            return wellbore
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['wellbores.view_wellbore'], accept_global_perms=False). \
                filter(well=self.kwargs.get('pk_well')).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Wellbore.objects.none()
        return queryset


# возвращает/удаляет/изменяет объект wellbore
class SingleWellboreView(RetrieveUpdateDestroyAPIView):
    serializer_class = WellboreSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['wellbores.view_wellbore'],
                                            accept_global_perms=False).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Wellbore.objects.none()
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
class DestroyWellboreView(DestroyAPIView):
    serializer_class = WellboreSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['wellbores.view_wellbore'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Wellbore.objects.none()
        return queryset

    # переопределение функции удаления объектов: удаляются также всем возможные permissions
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        del_perm(instance)
        return super().destroy(request, *args, **kwargs)


# возвращает список удаленных wellbore
class DeletedWellboreView(ListAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = WellboreSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['wellbores.view_wellbore'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Wellbore.objects.none()
        return queryset

    # переопределение функции, отвечающей на get-запрос, list_time - список времен до удаления объектов
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        response = get_objs_time_del(queryset, self.serializer_class)
        for wellbore in response:
            try:
                well = Well.objects.get(id=wellbore["well_id"])
                wellbore.update({"well_num": well.num_well})
            except ObjectDoesNotExist:
                pass
        return Response(response)


# восстановление удаленного wellbore
class RecoveryWellboreView(RetrieveUpdateAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = WellboreSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['wellbores.view_wellbore'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Wellbore.objects.none()
        return queryset

    # восстановление - время в ноль
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            Well.objects.get(id=instance.well.pk, time_deleted__isnull=True)
            recovery_object_and_children(instance)
            response_data = self.serializer_class(instance).data
        except ObjectDoesNotExist:
            response_data = "Well was deleted"
        return Response(response_data)


# возвращает список сводки
class SummaryView(ListAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = WellboreSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['wellbores.view_wellbore'],
                                            accept_global_perms=False).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Wellbore.objects.none()
        return queryset

    # переопределение функции, отвечающей на get-запрос, list_time - список времен до удаления объектов
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        response = []
        for wellbore in queryset:
            wellbore_dict = {"ILWD_TFS": wellbore.ILWD_TFS,
                             "ILWD_TLS": wellbore.ILWD_TLS,
                             "status_wellbore": wellbore.status_wellbore,
                             "num_wellbore": wellbore.num_wellbore,
                             "pie_well": wellbore.pie_well,
                             "id_wellbore": wellbore.pk,
                             "contractor": wellbore.contractor,
                             "main_strata": wellbore.main_strata,
                             "ILWD_I": wellbore.ILWD_I}
            well = wellbore.well
            wellbore_dict["well"] = well.num_well
            wellbore_dict["well_type"] = well.well_type
            if well:
                cluster = well.cluster
                wellbore_dict["cluster"] = cluster.name
                if cluster:
                    field = cluster.field
                    wellbore_dict["field"] = field.name
                    if field:
                        customer = field.customer
                        wellbore_dict["customer"] = customer.name
                        wellbore_dict["short_customer"] = customer.short
                        stratas = get_objects_for_user(self.request.user, ['strata.view_strata'],
                                                       accept_global_perms=False). \
                            filter(field=field, time_deleted__isnull=True)
                        if len(stratas) != 0:
                            strata_names = []
                            for strata in stratas:
                                strata_names.append(strata.name)
                            wellbore_dict["strata"] = strata_names

            qualitys = get_objects_for_user(self.request.user, ['quality_control.view_quality_control'],
                                            accept_global_perms=False).filter(time_deleted__isnull=True,
                                                                              wellbore=wellbore.pk)
            if len(qualitys) != 0:
                qualitys_list = []
                for quality in qualitys:
                    inform_for_methods = get_objects_for_user(self.request.user,
                                                              ['inform_for_method.view_inform_for_method'],
                                                              accept_global_perms=True).filter(quality_control=quality)

                    quality_dict = {"quality_control_id": quality.pk,
                                    "value": quality.value,
                                    "section_interval_start": quality.section_interval_start,
                                    "section_interval_end": quality.section_interval_end,
                                    "data_type": quality.data_type}
                    # "quality_value": quality.value,
                    # "quality_density": quality.density}
                    if len(inform_for_methods) != 0:
                        inf_meth_list = []
                        for inform_for_method in inform_for_methods:
                            inf_meth_dict = {"inform_for_method_id": inform_for_method.pk}
                            service_method = inform_for_method.service_method
                            if service_method is not None:
                                if service_method.service is not None:
                                    inf_meth_dict["service"] = service_method.service.name
                                    inf_meth_dict["short_service"] = service_method.service.short
                            inf_meth_list.append(inf_meth_dict)
                        quality_dict["inform_for_methods"] = inf_meth_list

                    qualitys_list.append(quality_dict)
                wellbore_dict["quality_controls"] = qualitys_list

            response.append(wellbore_dict)
        # print(response)

        return Response(response)
