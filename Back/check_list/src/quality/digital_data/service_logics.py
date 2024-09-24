from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_perms

from authorization_for_check.service_logics import send_all_permission
from .models import Digital_data
from .serializers import Digital_dataSerializer
from ..quality_control.models import Quality_control


# получение информации по Digital_data / создание Digital_data
class Digital_dataFullGetPost:
    def __init__(self, user):
        self.exception = None
        self.data = {}
        self.user = user

    # получение Digital_data по id quality_control
    def digital_data(self, pk):
        try:
            digital_data = Digital_data.objects.get(quality_control=pk)
            if self.user.has_perm('view_digital_data', digital_data):
                digital_data_dict = Digital_dataSerializer(digital_data).data
                del digital_data_dict['quality_control']
                self.data.update({"digital_data": digital_data_dict})
            else:
                pass
            # self.exception = "403"
        except Digital_data.DoesNotExist:
            self.exception = "Digital data Does Not Exist"
        return

    # создание Digital_data по id quality_control
    def post_digital_data(self, digital_data_dict, pk_quality_control):
        fields = [0]
        for value in Digital_data._meta.get_fields():
            fields = fields + [value.name]
        try:
            quality_control = Quality_control.objects.get(id=pk_quality_control)
            if self.user.has_perm('digital_data.add_digital_data'):
                try:
                    digital_data = Digital_data.objects.get(quality_control=quality_control,
                                                            **{key: value for key, value in
                                                               iter(digital_data_dict.items())
                                                               if key in fields})
                    if 'view_digital_data' not in get_perms(self.user, digital_data):
                        raise ObjectDoesNotExist
                except ObjectDoesNotExist:
                    digital_data = Digital_data.objects.create(quality_control=quality_control,
                                                               **{key: value for key, value in
                                                                  iter(digital_data_dict.items())
                                                                  if key in fields})
                    send_all_permission(self.user, digital_data, quality_control)
        except Quality_control.DoesNotExist:
            self.exception = 'Quality control Does Not Exist'
        return
