from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.http import Http404
from guardian.shortcuts import get_objects_for_user
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView, get_object_or_404, RetrieveUpdateDestroyAPIView, ListAPIView, \
    RetrieveUpdateAPIView, DestroyAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated
from rest_framework.response import Response

from authorization_for_check.service_logics import send_all_permission, del_perm
from customer_companies.clusters.models import Cluster
from customer_companies.clusters.serializers import ClusterSerializer
from customer_companies.fields.models import Field
from del_service.del_service_logic import get_objs_time_del, post_delete_time, recovery_object_and_children


# возвращает список customer без учета удаленных / создает объект cluster
class ClusterView(ListCreateAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = ClusterSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['clusters.view_cluster'],
                                            accept_global_perms=False).filter(field=self.kwargs.get('pk_field')).\
                filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Cluster.objects.none()
        return queryset

    # дополняет метод создания
    def create(self, request, *args, **kwargs):
        try:
            cluster = Cluster.objects.get(name=request.data.get('name'), field=self.kwargs.get('pk_field'))
            if cluster.time_deleted is not None:
                del_perm(cluster)
                cluster.delete()
            else:
                return Response(self.serializer_class(cluster).data)
        except ObjectDoesNotExist:
            pass
        except MultipleObjectsReturned:
            clusters = Cluster.objects.filter(name=request.data.get('name'), field=self.kwargs.get('pk_field'))
            clusters.delete()
        return super().create(request, *args, **kwargs)

    # переопределение функции выполнения создания объекта (устанавливаются permissions)
    def perform_create(self, serializer):
        try:
            field = Field.objects.get(id=self.request.data.get('field_id'))
        except Field.DoesNotExist:
            field = get_object_or_404(Field, id=self.kwargs.get('pk_field'))

        if self.request.user.has_perm('add_field', field):

            cluster = serializer.save(field=field)

            send_all_permission(self.request.user, cluster, field)

            return cluster
        else:
            raise PermissionDenied('You do not have permission to perform this action.')


# возвращает/удаляет/изменяет объект cluster
class SingleClusterView(RetrieveUpdateDestroyAPIView):
    serializer_class = ClusterSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['clusters.view_cluster'],
                                            accept_global_perms=False).filter(time_deleted__isnull=True)
        except ObjectDoesNotExist:
            queryset = Field.objects.none()
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
class DestroyClusterView(DestroyAPIView):
    serializer_class = ClusterSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['clusters.view_cluster'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Field.objects.none()
        return queryset

    # переопределение функции удаления объектов: удаляются также всем возможные permissions
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        del_perm(instance)
        return super().destroy(request, *args, **kwargs)


# возвращает список удаленных cluster
class DeletedClusterView(ListAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = ClusterSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['clusters.view_cluster'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Cluster.objects.none()
        return queryset

    # переопределение функции, отвечающей на get-запрос, list_time - список времен до удаления объектов
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        response = get_objs_time_del(queryset, self.serializer_class)
        for cluster in response:
            try:
                field = Field.objects.get(id=cluster["field_id"])
                cluster.update({"field_name": field.name})
            except ObjectDoesNotExist:
                pass
        return Response(response)


# восстановление удаленного cluster
class RecoveryClusterView(RetrieveUpdateAPIView):
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = ClusterSerializer

    # переопределение функции получения queryset объекта
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['clusters.view_cluster'],
                                            accept_global_perms=False).filter(time_deleted__isnull=False)
        except ObjectDoesNotExist:
            queryset = Cluster.objects.none()
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
