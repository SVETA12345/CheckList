from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
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
from ..clusters.models import Cluster
from .serializers import WellSerializer
from .models import Well


# возвращает список field без учета удаленных / создает объект field
from ..customers.models import Customer
from ..fields.models import Field


class WellView(ListCreateAPIView):
    serializer_class = WellSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            well = Well.objects.get(num_well=request.data.get('num_well'), num_pad=request.data.get('num_pad'),
                                    cluster=self.kwargs.get('pk_cluster'), well_type=request.data.get('well_type'))
            if well.time_deleted is not None:
                del_perm(well)
                well.delete()
            else:
                return Response(self.serializer_class(well).data)
        except ObjectDoesNotExist:
            pass
        except MultipleObjectsReturned:
            wells = Well.objects.filter(num_well=request.data.get('num_well'), num_pad=request.data.get('num_pad'),
                                        cluster=self.kwargs.get('pk_cluster'), well_type=request.data.get('well_type'))
            wells.delete()
        return super().create(request, *args, **kwargs)

    # переопределение функции выполнения создания объекта (устанавливаются permissions)
    def perform_create(self, serializer):
        try:
            cluster = Cluster.objects.get(id=self.request.data.get('cluster_id'))
        except Cluster.DoesNotExist:
            cluster = get_object_or_404(Cluster, id=self.kwargs.get('pk_cluster'))
        if self.request.user.has_perm('add_cluster', cluster):
            well = serializer.save(cluster=cluster)

            send_all_permission(self.request.user, well, cluster)

            return well
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['wells.view_well'], accept_global_perms=False).\
                filter(cluster=self.kwargs.get('pk_cluster')).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Well.objects.none()
        return queryset


# возвращает/удаляет/изменяет объект Well
class SingleWellView(RetrieveUpdateDestroyAPIView):
    # queryset = Well.objects.all()
    serializer_class = WellSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['wells.view_well'],
                                            accept_global_perms=False).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Well.objects.none()
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
class DestroyWellView(DestroyAPIView):
    serializer_class = WellSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['wells.view_well'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Well.objects.none()
        return queryset

    # переопределение функции удаления объектов: удаляются также всем возможные permissions
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        del_perm(instance)
        return super().destroy(request, *args, **kwargs)


# возвращает список удаленных well
class DeletedWellView(ListAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = WellSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['wells.view_well'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Well.objects.none()
        return queryset

    # переопределение функции, отвечающей на get-запрос, list_time - список времен до удаления объектов
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        response = get_objs_time_del(queryset, self.serializer_class)
        for well in response:
            try:
                cluster = Cluster.objects.get(id=well["cluster_id"])
                field = Field.objects.get(id=cluster.field.pk)
                customer = Customer.objects.get(id=field.customer.pk)
                well.update({"customer_name": customer.name,
                             "short_customer": customer.short})
            except ObjectDoesNotExist:
                pass
        return Response(response)


# восстановление удаленного well
class RecoveryWellView(RetrieveUpdateAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = WellSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['wells.view_well'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Well.objects.none()
        return queryset

    # восстановление - время в ноль
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            Cluster.objects.get(id=instance.cluster.pk, time_deleted__isnull=True)
            recovery_object_and_children(instance)
            response_data = self.serializer_class(instance).data
        except ObjectDoesNotExist:
            response_data = "Cluster was deleted"
        return Response(response_data)