import os
import lasio
import pandas as pd

from django.core.exceptions import ObjectDoesNotExist
from django.core.files.storage import default_storage
from guardian.shortcuts import get_objects_for_user
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import CreateAPIView, \
    get_object_or_404, ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated

from authorization_for_check.service_logics import send_all_permission
from rest_framework.response import Response

from ..quality_control.models import Quality_control
from .models import Las_file
from .serializers import Las_fileSerializer
from rest_framework.views import APIView


class Las_read_interval(APIView):
    """Читаем интервал с лас файла """
    def post(self, request):
        if request.FILES.get('file'):
            file = default_storage.save(request.FILES.get('file').name, request.FILES.get('file'))
            path = os.getcwd() + '/check_list/src/files_root/' + file
            las = lasio.read(path)
            if 'DEPTH' in las.keys():
                Depth_key = 'DEPTH'
            elif 'MD' in las.keys():
                Depth_key = 'MD'
            else:
                Depth_key = 'DEPT'
            las_data_frame = pd.DataFrame.from_dict(dict(las))
            dropNan = las_data_frame.dropna()
            # print(f"{dropNan.iloc[0][Depth_key]} - {dropNan.iloc[-1][Depth_key]}")
            return Response({'start_interval': dropNan.iloc[0][Depth_key],
                             'end_interval': dropNan.iloc[-1][Depth_key]})
        else:
            return Response({'status': "Отсутствует файл под ключом file"})


# создание Las_file
class Las_fileCreateView(CreateAPIView):
    # queryset = Las_file.objects.all()
    serializer_class = Las_fileSerializer

    permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # выполнение создания + установка permissions
    def perform_create(self, serializer):
        try:
            quality_control = Quality_control.objects.get(id=self.request.data.get('quality_control_id'))
        except Quality_control.DoesNotExist:
            quality_control = get_object_or_404(Quality_control, id=self.kwargs.get('pk_quality_control'))
        if self.request.user.has_perm('add_quality_control', quality_control):
            las_file = serializer.save(quality_control=quality_control)
            send_all_permission(self.request.user, las_file, quality_control)
            return las_file
        else:
            raise PermissionDenied('You do not have permission to perform this action.')

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['las_file.view_las_file'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Las_file.objects.none()
        return queryset


# получение списка Las_file
class Las_fileView(ListAPIView):
    # queryset = Las_file.objects.all()
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = Las_fileSerializer

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['las_file.view_las_file'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Las_file.objects.none()
        return queryset


# получение объекта Full_inform / обновление информации об объекте
class SingleLas_fileView(RetrieveUpdateAPIView):
    # queryset = Las_file.objects.all()
    permission_classes = [DjangoObjectPermissions, IsAuthenticated]
    serializer_class = Las_fileSerializer

    # получение queryset
    def get_queryset(self):
        try:
            queryset = get_objects_for_user(self.request.user, ['las_file.view_las_file'],
                                            accept_global_perms=False)
        except ObjectDoesNotExist:
            queryset = Las_file.objects.none()
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
