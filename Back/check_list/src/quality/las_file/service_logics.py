from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_perms

from authorization_for_check.service_logics import send_all_permission
from .models import Las_file
from .serializers import Las_fileSerializer
from ..quality_control.models import Quality_control


# получение информации по Las_file / создание Las_file
class Las_fileFullGetPost:
    def __init__(self, user):
        self.exception = None
        self.data = {}
        self.user = user

    # получение Las_file по id quality_control
    def las_file(self, pk):
        try:
            las_file = Las_file.objects.get(quality_control=pk)
            if self.user.has_perm('view_las_file', las_file):
                las_file_dict = Las_fileSerializer(las_file).data
                del las_file_dict['quality_control_id']
                self.data.update({"las_file": las_file_dict})
            else:
                pass
            # self.exception = "403"
        except Las_file.DoesNotExist:
            self.exception = "Las file Does Not Exist"
        return

    # создание Las_file по id quality_control
    def post_las_file(self, las_file_dict, pk_quality_control):
        fields = [0]
        for value in Las_file._meta.get_fields():
            fields = fields + [value.name]
        try:
            quality_control = Quality_control.objects.get(id=pk_quality_control)
            if self.user.has_perm('las_file.add_las_file'):
                try:
                    las_file = Las_file.objects.get(quality_control=quality_control,
                                                            **{key: value for key, value in
                                                               iter(las_file_dict.items())
                                                               if key in fields})
                    if 'view_las_file' not in get_perms(self.user, las_file):
                        raise ObjectDoesNotExist
                except ObjectDoesNotExist:
                    las_file = Las_file.objects.create(quality_control=quality_control,
                                                               **{key: value for key, value in
                                                                  iter(las_file_dict.items())
                                                                  if key in fields})
                    send_all_permission(self.user, las_file, quality_control)
        except Quality_control.DoesNotExist:
            self.exception = 'Quality control Does Not Exist'
        return
