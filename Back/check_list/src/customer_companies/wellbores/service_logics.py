from rest_framework.exceptions import PermissionDenied

from authorization_for_check.service_logics import send_all_permission
from .models import Wellbore
from .serializers import WellboreSerializer
from ..wells.models import Well
from ..wells.service_logics import WellFullPostServices


class WellboreFullGet:
    def __init__(self, user):
        self.exception = None
        self.data = {}
        self.well = 0
        self.user = user  # для проверки доступа к объекту

    # возвращает параметры объекта well в словаре по pk_well
    def wellbore(self, pk_wellbore):
        try:
            wellbore = Wellbore.objects.get(id=pk_wellbore)
            if self.user.has_perm('view_wellbore', wellbore):
                # self.data.update({"num_wellbore": wellbore.num_wellbore,
                #                   "pie_well": wellbore.pie_well,
                #                   "diametr": wellbore.diametr,
                #                   "well_id": wellbore.well.pk,
                #                   "wellbore_id": wellbore.pk})
                self.data.update(WellboreSerializer(wellbore).data)
                self.data.update({"wellbore_id": wellbore.pk})
                del self.data["id"]
                self.well = wellbore.well.pk
                if wellbore.well is None:
                    self.exception = "Well Does Not Exist"
            else:
                raise PermissionDenied('You do not have permission to perform this action.')
        except Wellbore.DoesNotExist:
            self.exception = "Wellbore Does Not Exist"
        return


# class WellboreFullPostServices:
#     def __init__(self, data, user):
#         self.well_data = data[:4]
#         self.exception = None
#         self.pie_well = data[5]  # .get('pie_well')
#         # self.section_interval_start = data[6]  # .get('section_interval_start')
#         # self.section_interval_end = data[7]  # .get('section_interval_end')
#         self.diametr = data[6]  # .get('diametr')
#         self.num_wellbore = data[4]  # .get('num_wellbore')
#         self.user = user
#
#     # вызывает класс по созданию объекта well по заданным параметрам
#     def well(self):
#         well_service = WellFullPostServices(self.well_data, self.user)
#         well = well_service.well()
#         if well_service.exception is None:
#             return well.pk
#         else:
#             self.exception = well_service.exception
#             return None
#
#     # создает по заданным параметрам объект wellbore
#     def wellbore(self):
#         pr_well = self.well()
#
#         if pr_well is not None:
#             well = Well.objects.get(id=pr_well)
# 
#             if self.user.has_perm("wells.view_well"):
#                 try:
#                     wellbore = Wellbore.objects.get(num_wellbore=self.num_wellbore)
#                 except Wellbore.DoesNotExist:
#
#                     if self.user.has_perm("wellbores.add_wellbore"):
#                         wellbore = Wellbore.objects.create(well=well, pie_well=self.pie_well,
#                                                    diametr=self.diametr, num_wellbore=self.num_wellbore)
#
#                         send_all_permission(self.user, wellbore, well)
#
#                     else:
#                         raise PermissionDenied('You do not have permission to perform this action.')
#                 return wellbore.pk
#             else:
#                 raise PermissionDenied('You do not have permission to perform this action.')
#         else:
#             self.exception = 'Well Does Not Exist'
#             return None
