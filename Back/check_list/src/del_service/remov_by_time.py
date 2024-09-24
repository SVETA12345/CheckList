from django.core.exceptions import ObjectDoesNotExist
from django.db.models import ForeignObjectRel
from django.db.models.deletion import Collector
from django.utils import timezone

from authorization_for_check.service_logics import del_perm
from check_list.settings import DELTA_DELETE_TIME
from customer_companies.customers.models import Customer
from service_companies.services.models import Service


# вычисляется время, прошедшее с удаления в днях
def get_delta_days(time_deleted):
    if time_deleted:
        return abs((time_deleted - timezone.localtime(timezone.now())).days)
    else:
        return 0


# удаляется объект и его permissions, если он был удален больше DELTA_DELETE_TIME назад
def delete_obj(obj):
    try:
        if get_delta_days(obj.time_deleted) > DELTA_DELETE_TIME:
            del_perm(obj)
            obj.delete()
    except AttributeError:
        pass


# проходится по дочерним объектам и удаляет их
def iterate_child_elements(parent_object):
    collector = Collector(using="default")
    collector.collect([parent_object])

    for objects_all_cascade_model in collector.data.values():
        for obj in objects_all_cascade_model:
            links = [field_name.get_accessor_name() for field_name in obj._meta.get_fields() if
                     issubclass(type(field_name), ForeignObjectRel)]
            for link in links:
                try:
                    objects_child = getattr(obj, link)
                    try:
                        # если несколько объектов, проходимся по ним, если один - устанавливаем уже на него
                        for object_child in objects_child.all():
                            delete_obj(object_child)
                    except AttributeError:
                        delete_obj(objects_child)
                except ObjectDoesNotExist:
                    pass


# проходится по родительским/дочерним объектам и удаляет их
def delete_parent_and_child(queryset):
    for parent in queryset:
        delete_obj(parent)
        iterate_child_elements(parent)


# удаление, за родительские элементы берутся Customer и Service
def remove():
    delete_parent_and_child(Customer.objects.all())
    delete_parent_and_child(Service.objects.all())
