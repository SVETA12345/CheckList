from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_objects_for_user
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404, ListAPIView, \
    CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated

from authorization_for_check.service_logics import send_all_permission
from .models import Second_table
from .serializers import Second_tableSerializer
from ..inform_for_method.models import Inform_for_method


# создание Second_table
class Second_tableCreateView(CreateAPIView):
    # queryset = Second_table.objects.all()
    serializer_class = Second_tableSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # выполнение создания + установка permissions
    def perform_create(self, serializer):
        try:
            inform_for_method = Inform_for_method.objects.get(id=self.request.data.get('inform_for_method_id'))
        except Inform_for_method.DoesNotExist:
            inform_for_method = get_object_or_404(Inform_for_method, id=self.kwargs.get('pk_inform_for_method'))
        if self.request.user.has_perm('add_inform_for_method', inform_for_method):
            second_table = serializer.save(inform_for_method=inform_for_method)
            send_all_permission(self.request.user, second_table, inform_for_method)
            return second_table
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['second_table.view_second_table'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Second_table.objects.none()
        return queryset


# получение списка Second_table
class Second_tableView(ListAPIView):
    # queryset = Second_table.objects.all()
    serializer_class = Second_tableSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['second_table.view_second_table'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Second_table.objects.none()
        return queryset


# получение объекта Second_table / обновление информации об объекте
class SingleSecond_tableView(RetrieveUpdateAPIView):
    # queryset = Second_table.objects.all()
    serializer_class = Second_tableSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['second_table.view_second_table'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Second_table.objects.none()
        return queryset

    # def destroy(self, request, *args, **kwargs):
    #     try:
    #         instance = self.get_object()
    #         filters = Q(content_type=ContentType.objects.get_for_model(instance),
    #                     object_pk=instance.pk)
    #         UserObjectPermission.objects.filter(filters).delete()
    #         GroupObjectPermission.objects.filter(filters).delete()
    #         self.perform_destroy(instance)
    #     except Http404:
    #         pass
    #     return Response(status=status.HTTP_204_NO_CONTENT)