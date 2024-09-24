from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_perms

from authorization_for_check.service_logics import send_all_permission
from .models import Full_inform
from .serializers import Full_informSerializer
from ..quality_control.models import Quality_control


# получение информации по Full_inform / создание Full_inform
class Full_informFullGetPost:
    def __init__(self, user):
        self.exception = None
        self.data = {}
        self.user = user

    # получение Full_inform по id quality_control
    def full_inform(self, pk):
        try:
            full_inform = Full_inform.objects.get(quality_control=pk)
            if self.user.has_perm('view_full_inform', full_inform):
                full_inform_dict = Full_informSerializer(full_inform).data
                del full_inform_dict['quality_control_id']
                self.data.update({"full_inform": full_inform_dict})
            else:
                pass
            # self.exception = "403"
        except Full_inform.DoesNotExist:
            self.exception = "Full inform Does Not Exist"
        return

    # создание Full_inform по id quality_control
    def post_full_inform(self, full_inform_dict, pk_quality_control):
        fields = [0]
        for value in Full_inform._meta.get_fields():
            fields = fields + [value.name]
        try:
            quality_control = Quality_control.objects.get(id=pk_quality_control)
            if self.user.has_perm('full_inform.add_full_inform'):
                try:
                    full_inform = Full_inform.objects.get(quality_control=quality_control,
                                                            **{key: value for key, value in
                                                               iter(full_inform_dict.items())
                                                               if key in fields})
                    if 'view_full_inform' not in get_perms(self.user, full_inform):
                        raise ObjectDoesNotExist
                except ObjectDoesNotExist:
                    full_inform = Full_inform.objects.create(quality_control=quality_control,
                                                               **{key: value for key, value in
                                                                  iter(full_inform_dict.items())
                                                                  if key in fields})
                    send_all_permission(self.user, full_inform, quality_control)

        except Quality_control.DoesNotExist:
            self.exception = 'Quality control Does Not Exist'
            return
