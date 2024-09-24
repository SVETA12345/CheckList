from django.db.models import ForeignObjectRel, ForeignKey
from django.db.models.deletion import Collector
from django.utils import timezone


# получение списка удаленных элементов с времени удаления
def get_objs_time_del(queryset, serializer_class):
    list_time_objs = []
    for element in queryset:
        element_dict = serializer_class(element).data
        element_dict.update(get_time_before_del(element))
        list_time_objs = list_time_objs + [element_dict]
    return list_time_objs


# сравнение времен дочернего и родительского объектов
def check_difference_time(element, child_element):
    try:
        element_time = timezone.localtime(element.time_deleted)
        child_element_time = timezone.localtime(child_element.time_deleted)
        # seconds = ((child_element_time - element_time).seconds // 60) % 60
        return child_element_time == element_time
    except AttributeError:
        return False


# возвращает время, которое прошло с момента удаления
def get_time_before_del(element):
    return days_hours_minutes(timezone.localtime(timezone.now()) - timezone.localtime(element.time_deleted))


# возвращает время, которое прошло с момента удаления
def days_hours_minutes(td):
    days, hours, minutes = td.days, td.seconds // 3600, (td.seconds // 60) % 60
    return {"time_before_del": f'{days}:{hours}:{minutes}'}


# установка времени удаления объекта
def delete_time(deleted_object):
    if deleted_object.time_deleted is None:
        deleted_object.time_deleted = timezone.localtime(timezone.now())
        deleted_object.save()


# установка времени удаления дочернего объекта (если он не удален) на время удаления родительского
def delete_time_children(deleted_object, parent_object):
    try:
        if deleted_object.time_deleted is None:
            deleted_object.time_deleted = parent_object.time_deleted
            deleted_object.save()
    except AttributeError:
        pass


# установка времени удаления в ноль - "восстановление" объекта
def post_null_delete_time(deleted_object):
    deleted_object.time_deleted = None
    deleted_object.save()


# проходится по всем дочерним объектам родительского элемента
def iterate_child_elements(parent_object, func, connetction):
    collector = Collector(using="default")
    collector.collect([parent_object])
    for objects_all_cascade_model in collector.data.values():
        for obj in objects_all_cascade_model:
            if connetction is ForeignObjectRel:
                links = [field_name.get_accessor_name() for field_name in obj._meta.get_fields() if
                         issubclass(type(field_name), connetction)]
            else:
                links = [field_name.name for field_name in obj._meta.get_fields() if
                         issubclass(type(field_name), connetction)]

            for link in links:
                objects_child = getattr(obj, link)
                try:
                    # если несколько объектов, проходимся по ним, если один - устанавливаем уже на него
                    for object_child in objects_child.all():
                        func(object_child, parent_object)
                except AttributeError:
                    func(objects_child, parent_object)


# установка для всех дочерних элементов (если они не удалены) времени удаления родительского объекта
def post_delete_time_children(parent_object):
    iterate_child_elements(parent_object, delete_time_children, ForeignObjectRel)


# установка для всех дочерних элементов (если они удалены вместе с родительским) времени в ноль - восстановление
def recovery_children(parent_object):
    iterate_child_elements(parent_object, check_deleted_time, ForeignKey)


# установка времени дочерного объекта в ноль, если время удаляения с родительским совпадают
def check_deleted_time(object_child, parent_object):
    try:
        if object_child.time_deleted is not None:
            # if check_difference_time(parent_object, object_child):
            post_null_delete_time(object_child)
    except:
        pass


# установка времени объектов (родительский + дочерние) в ноль - восстановление
def recovery_object_and_children(parent_object):
    recovery_children(parent_object)
    post_null_delete_time(parent_object)


# установка времени удаления объектов (родительский + дочерние)
def post_delete_time(parent_object):
    delete_time(parent_object)
    post_delete_time_children(parent_object)
