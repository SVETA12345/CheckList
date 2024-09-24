from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_objects_for_user
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import CreateAPIView, \
    get_object_or_404, ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated
from authorization_for_check.service_logics import send_all_permission
from ..quality_control.models import Quality_control
from .models import Full_inform
from .serializers import Full_informSerializer


# создание Full_inform
class Full_informCreateView(CreateAPIView):
    # queryset = Full_inform.objects.all()
    serializer_class = Full_informSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # выполнение создания + установка permissions
    def perform_create(self, serializer):
        try:
            quality_control = Quality_control.objects.get(id=self.request.data.get('quality_control_id'))
        except Quality_control.DoesNotExist:
            quality_control = get_object_or_404(Quality_control, id=self.kwargs.get('pk_quality_control'))
        if self.request.user.has_perm('add_quality_control', quality_control):
            full_inform = serializer.save(quality_control=quality_control)
            send_all_permission(self.request.user, full_inform, quality_control)
            return full_inform
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['full_inform.view_full_inform'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Full_inform.objects.none()
        return queryset


# получение списка Full_inform
class Full_informView(ListAPIView):
    # queryset = Full_inform.objects.all()
    serializer_class = Full_informSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['full_inform.view_full_inform'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Full_inform.objects.none()
        return queryset


# получение объекта Full_inform / обновление информации об объекте
class SingleFull_informView(RetrieveUpdateAPIView):
    # queryset = Full_inform.objects.all()
    serializer_class = Full_informSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['full_inform.view_full_inform'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Full_inform.objects.none()
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