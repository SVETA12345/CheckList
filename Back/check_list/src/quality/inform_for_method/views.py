from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_objects_for_user
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView, get_object_or_404, ListAPIView, \
    CreateAPIView, RetrieveDestroyAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated
from rest_framework.views import APIView
from authorization_for_check.service_logics import send_all_permission, del_perm
from service_companies.service_method.models import Service_method
from .service_logics import InformMethodFullPostServices
from ..quality_control.models import Quality_control
from .models import Inform_for_method, Koef_fail, Koef_shod
from .serializers import Inform_for_methodSerializer, Koef_shodSerializer, Koef_failSerializer


# возвращает список объектов inform_for_method / создает объект inform_for_method
class Inform_for_methodListCreateView(ListCreateAPIView):
    serializer_class = Inform_for_methodSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # выполнение создания inform_for_method + установка permissions
    def perform_create(self, serializer):
        try:
            quality_control = Quality_control.objects.get(id=self.request.data.get('quality_control_id'))
        except Quality_control.DoesNotExist:
            quality_control = get_object_or_404(Quality_control, id=self.kwargs.get('pk_quality_control'))

        service_method = get_object_or_404(Service_method, id=self.request.data.get('service_method_id'))
        if self.request.user.has_perm('add_quality_control', quality_control) \
                and self.request.user.has_perm('add_service_method', service_method):
            inform_for_method = serializer.save(quality_control=quality_control, service_method=service_method)
            send_all_permission(self.request.user, inform_for_method, quality_control)
            return inform_for_method
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['inform_for_method.view_inform_for_method'],
                                            accept_global_perms=False).filter(
                quality_control=self.kwargs.get('pk_quality_control'))
        except ObjectDoesNotExist:
            queryset = Inform_for_method.objects.none()
        return queryset


# получение объекта Inform_for_method
class SingleInform_for_methodView(RetrieveDestroyAPIView):
    # queryset = Inform_for_method.objects.all()
    serializer_class = Inform_for_methodSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['inform_for_method.view_inform_for_method'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Inform_for_method.objects.none()
        return queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        del_perm(instance)
        return super().destroy(request, *args, **kwargs)


# создание Koef_fail
class Koef_failCreateView(CreateAPIView):
    # queryset = Koef_fail.objects.all()
    serializer_class = Koef_failSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # выполнение создания Koef_fail + все permissions
    def perform_create(self, serializer):
        try:
            inform_for_method = Inform_for_method.objects.get(id=self.request.data.get('inform_for_method_id'))
        except Inform_for_method.DoesNotExist:
            inform_for_method = get_object_or_404(Inform_for_method, id=self.kwargs.get('pk_inform_for_method'))
        if self.request.user.has_perm('add_inform_for_method', inform_for_method):
            koef_fail = serializer.save(inform_for_method=inform_for_method)
            send_all_permission(self.request.user, koef_fail, inform_for_method)
            return koef_fail
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['inform_for_method.view_koef_fail'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Koef_fail.objects.none()
        return queryset


# получение списка Koef_fail
class Koef_failView(ListAPIView):
    # queryset = Koef_fail.objects.all()
    serializer_class = Koef_failSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['inform_for_method.view_koef_fail'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Koef_fail.objects.none()
        return queryset


# получение объекта Koef_fail / обновление информации об объекте
class SingleKoef_failView(RetrieveUpdateAPIView):
    # queryset = Koef_fail.objects.all()
    serializer_class = Koef_failSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['inform_for_method.view_koef_fail'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Koef_fail.objects.none()
        return queryset

    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     del_perm(instance)
    #     return super().destroy(request, *args, **kwargs)


# создание Koef_shod
class Koef_shodCreateView(CreateAPIView):
    # queryset = Koef_shod.objects.all()
    serializer_class = Koef_shodSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # выполнение создания Koef_shod + все permissions
    def perform_create(self, serializer):
        try:
            inform_for_method = Inform_for_method.objects.get(id=self.request.data.get('inform_for_method_id'))
        except Inform_for_method.DoesNotExist:
            inform_for_method = get_object_or_404(Inform_for_method, id=self.kwargs.get('pk_inform_for_method'))
        if self.request.user.has_perm('add_inform_for_method', inform_for_method):
            koef_shod = serializer.save(inform_for_method=inform_for_method)
            send_all_permission(self.request.user, koef_shod, inform_for_method)
            return koef_shod
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['inform_for_method.view_koef_shod'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Koef_shod.objects.none()
        return queryset


# получение списка Koef_shod
class Koef_shodView(ListAPIView):
    # queryset = Koef_shod.objects.all()
    serializer_class = Koef_shodSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['inform_for_method.view_koef_shod'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Koef_shod.objects.none()
        return queryset


# получение объекта Koef_shod / обновление информации об объекте
class SingleKoef_shodView(RetrieveUpdateAPIView):
    # queryset = Koef_shod.objects.all()
    serializer_class = Koef_shodSerializer
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['inform_for_method.view_koef_shod'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Koef_shod.objects.none()
        return queryset

    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     del_perm(instance)
    #     return super().destroy(request, *args, **kwargs)


# изменение / создание метода
class PutAndPostView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        pk_quality_control = self.kwargs.get('pk_quality_control')
        # data = json.loads(self.request.data)
        data = [self.request.data["service_id"], self.request.data["inform_for_method"],
                self.request.data["second_table"]]
        inform_method_full_put_post_service = InformMethodFullPostServices(data, pk_quality_control, self.request.user)
        return inform_method_full_put_post_service.create_update()
