from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_perms

from authorization_for_check.service_logics import send_all_permission
from .models import Witsml
from .serializers import WitsmlSerializer
from ..quality_control.models import Quality_control


# получение информации по Witsml / создание Witsml
class WitsmlFullGetPost:
    def __init__(self, user):
        self.exception = None
        self.data = {}
        self.user = user

    # получение Witsml по id quality_control
    def witsml(self, pk):
        try:
            witsml = Witsml.objects.get(quality_control=pk)
            if self.user.has_perm('view_witsml', witsml):
                witsml_dict = WitsmlSerializer(witsml).data
                del witsml_dict['quality_control_id']
                self.data.update({"witsml": witsml_dict})
            else:
                pass
            # self.exception = "403"
        except Witsml.DoesNotExist:
            self.exception = "Witsml Does Not Exist"
        return

    # создание Witsml по id quality_control
    def post_witsml(self, witsml_dict, pk_quality_control):
        fields = [0]
        for value in Witsml._meta.get_fields():
            fields = fields + [value.name]
        try:
            quality_control = Quality_control.objects.get(id=pk_quality_control)
            if self.user.has_perm('witsml.add_witsml'):
                try:
                    witsml = Witsml.objects.get(quality_control=quality_control,
                                                            **{key: value for key, value in
                                                               iter(witsml_dict.items())
                                                               if key in fields})
                    if 'view_witsml' not in get_perms(self.user, witsml):
                        raise ObjectDoesNotExist
                except ObjectDoesNotExist:
                    witsml = Witsml.objects.create(quality_control=quality_control,
                                                               **{key: value for key, value in
                                                                  iter(witsml_dict.items())
                                                                  if key in fields})
                    send_all_permission(self.user, witsml, quality_control)

        except Quality_control.DoesNotExist:
            self.exception = 'Quality control Does Not Exist'
        return
