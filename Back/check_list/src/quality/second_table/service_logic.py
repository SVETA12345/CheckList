from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_perms

from authorization_for_check.service_logics import send_all_permission
from .models import Inform_for_method, Second_table
from .serializers import Second_tableSerializer


# получение информации по Second_table / создание Second_table
class SecondTableFullGetPost:
    def __init__(self, user):
        # self.exception = None
        self.data = {}
        self.user = user

    # получение Second_table по id quality_control
    def second_table(self, pk):
        try:
            second_table = Second_table.objects.get(inform_for_method=pk)
            if self.user.has_perm('view_second_table', second_table):
                if second_table:
                    self.data.update(Second_tableSerializer(second_table).data)

            # self.exception = "403"
        except Second_table.DoesNotExist:
            pass
            # self.exception = "Second table Does Not Exist"
        return

    # создание / обновление Second_table по id quality_control
    def post_second_table(self, inform_for_method, inform_for_method_id, second_table):
        second_table_dict = {}
        fields_second = []
        for value in Second_table._meta.get_fields():
            fields_second = fields_second + [value.name]
        for y in second_table:
            if y['inform_for_method_id'] == inform_for_method_id:
                second_table_dict.update(y)
        second_table_id = second_table_dict['inform_for_method_id']
        del second_table_dict['inform_for_method_id']
        try:
            second_table = Second_table.objects.get(inform_for_method=second_table_id)

            for key, value in iter(second_table_dict.items()):
                setattr(second_table, key, value)
            second_table.save()

        except Second_table.DoesNotExist:
            if self.user.has_perm('second_table.add_second_table'):
                try:
                    second_table = Second_table.objects.get(inform_for_method=inform_for_method,
                                                                           **{key: value for key, value in
                                                                              iter(second_table_dict.items())
                                                                              if key in fields_second})
                    if 'view_second_table' not in get_perms(self.user, second_table):
                        raise ObjectDoesNotExist
                except ObjectDoesNotExist:
                    second_table = Second_table.objects.create(inform_for_method=inform_for_method,
                                                                           **{key: value for key, value in
                                                                              iter(second_table_dict.items())
                                                                              if key in fields_second})
                    send_all_permission(self.user, second_table, inform_for_method)
