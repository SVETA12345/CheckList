from rest_framework.exceptions import PermissionDenied

from authorization_for_check.service_logics import send_all_permission
from .models import Well
from ..clusters.models import Cluster


class WellFullGet:
    def __init__(self, user):
        self.exception = None
        self.data = {}
        self.cluster = 0
        self.user = user  # для проверки доступа к объекту

    # возвращает параметры объекта well в словаре по pk_well
    def well(self, pk_well):
        try:
            well = Well.objects.get(id=pk_well)
            if self.user.has_perm('view_well', well):
                self.data.update({"num_pad": well.num_pad,
                                  "num_well": well.num_well,
                                  "well_id": well.pk,
                                  "well_type": well.well_type})
                if well.cluster is None:
                    self.exception = "Cluster Does Not Exist"
                    return
                self.cluster = well.cluster.pk
            else:
                raise PermissionDenied('You do not have permission to perform this action.')
        except Well.DoesNotExist:
            self.exception = "Well Does Not Exist"
        return


class WellFullPostServices:
    def __init__(self, data, user):
        self.exception = None
        self.pk_cluster = data[0]
        self.num_pad = data[1]
        self.num_well = data[2]
        self.well_type = data[3]
        self.user = user

    # создает по заданным параметрам объект well
    def well(self):
        try:
            cluster = Cluster.objects.get(id=self.pk_cluster)  # self.data.get('cluster'))
            if self.user.has_perm("fields.view_field"):
                try:
                    well = Well.objects.get(num_well=self.num_well)
                except Well.DoesNotExist:

                    if self.user.has_perm("wells.add_well"):
                        well = Well.objects.create(num_pad=self.num_pad, num_well=self.num_well,
                                                   well_type=self.well_type, field=cluster)

                        send_all_permission(self.user, well, cluster)

                    else:
                        raise PermissionDenied('You do not have permission to perform this action.')

                return well
            else:
                raise PermissionDenied('You do not have permission to perform this action.')
        except Cluster.DoesNotExist:
            self.exception = "Field Does Not Exist"
        return
