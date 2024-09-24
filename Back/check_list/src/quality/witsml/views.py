from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_objects_for_user
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import CreateAPIView, \
    get_object_or_404, ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated
from authorization_for_check.service_logics import send_all_permission
from ..quality_control.models import Quality_control
from .models import Witsml
from .serializers import WitsmlSerializer


# создание Witsml
class WitsmlCreateView(CreateAPIView):
    # queryset = Witsml.objects.all()
    serializer_class = WitsmlSerializer

    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # выполнение создания + установка permissions
    def perform_create(self, serializer):
        try:
            quality_control = Quality_control.objects.get(id=self.request.data.get('quality_control_id'))
        except Quality_control.DoesNotExist:
            quality_control = get_object_or_404(Quality_control, id=self.kwargs.get('pk_quality_control'))
        if self.request.user.has_perm('add_quality_control', quality_control):
            witsml = serializer.save(quality_control=quality_control)
            send_all_permission(self.request.user, witsml, quality_control)
            return witsml
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['witsml.view_witsml'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Witsml.objects.none()
        return queryset


# получение списка Full_inform
class WitsmlView(ListAPIView):
    # queryset = Witsml.objects.all()
    serializer_class = WitsmlSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['witsml.view_witsml'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Witsml.objects.none()
        return queryset


# получение объекта Witsml / обновление информации об объекте
class SingleWitsmlView(RetrieveUpdateAPIView):
    # queryset = Witsml.objects.all()
    serializer_class = WitsmlSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['witsml.view_witsml'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Witsml.objects.none()
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