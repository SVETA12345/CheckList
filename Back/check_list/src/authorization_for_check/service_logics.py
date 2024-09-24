from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from guardian.models import UserObjectPermission, GroupObjectPermission
from customer_companies.customers.models import Customer
from .models import User
from guardian.shortcuts import assign_perm, get_user_perms
from rest_framework.exceptions import ValidationError
from django.db.models.fields.related import ForeignObjectRel
from django.db.models.deletion import Collector


# удаление всех permissions, групп у user
def clear_all_permission_group(user):
    clear_all_permission(user)
    user.groups.clear()
    user.get_all_permissions().clear()


# удаление всех UserObjectPermission по user.pk
def clear_all_permission(user):
    filters = Q(user=user.pk)
    UserObjectPermission.objects.filter(filters).delete()


# !!!ПРЕДУСМОТРЕТЬ ОКОНЧАТЕЛЬНОЕ УДАЛЕНИЕ PERMISSIONS (del_perm)
# разрешения на объекты работают ожидаемо:
# если существует группа только с глобальными разрешениями + группа с разрешениями на объекты,
# работать будут разрешения на пересечении групп


# получение permission для просмотра объекта
def get_view_permission_for_object(obj):
    view_permissions = [
        f"view_{obj._meta.model_name}",
    ]
    return view_permissions


# получение permission по умолчанию для объекта
def get_default_permission_for_object(obj):
    default_permissions = [
        f"view_{obj._meta.model_name}",
        f"add_{obj._meta.model_name}",
        f"delete_{obj._meta.model_name}",
        f"change_{obj._meta.model_name}"
    ]
    return default_permissions


# просто устанавливает заданные permissions заданному user для объекта obj
def send_ready_permission(user, obj, permissions):
    if obj is not None:
        for permission in permissions:
            assign_perm(permission, user, obj)
            # f'view_{obj._meta.model_name}'
    else:
        raise ValidationError('Error while creating object')


# находит всех юзеров, которые принадлежат к группе на универсальный просмотр,
# устанавливает для них просмотр переданного объекта
# если необходимо будет проверить, принадлежит ли юзер какой-то к этой группе, то же самое,
# только под юзера и с проверкой
def send_permission_for_super_view(obj):
    users = User.objects.all()
    for user in users:
        for group in user.groups.all():
            if group.name == "superviewer":
                assign_perm(f"view_{obj._meta.model_name}", user, obj)
                # return true # если проверять на доступ для всех view


# находит всех юзеров, которые принадлежат к группе superuser,
# устанавливает для них permission по умолчанию
def send_permission_for_super_user(obj):
    users = User.objects.all()
    for user in users:
        for group in user.groups.all():
            if group.name == "superuser":
                permissions = get_default_permission_for_object(obj)
                send_ready_permission(user, obj, permissions)


# возвращает permission для объекта, если оно входит в permissions родительского объекта
def get_filter_permission_for_obj(permission, obj, parent_obj):
    if permission in get_default_permission_for_object(parent_obj):
        new_permission = permission.replace(parent_obj._meta.model_name, obj._meta.model_name)
        return new_permission
    return


# устанавивает все необходимые permissions при создании нового объекта
def send_all_permission(user, obj, parent_obj):
    permissions = get_default_permission_for_object(obj)
    send_ready_permission(user, obj, permissions)
    send_permission_for_super_view(obj)
    # send_permission_for_super_user(field)
    send_all_user_with_permission_on_parent_obj(parent_obj, obj)


# устанавивает всем users, у которых есть permissions на родительский объект, такие же permissions на дочерний
def send_all_user_with_permission_on_parent_obj(parent_obj, obj):
    users = User.objects.all()
    for user in users:
        permissions = get_user_perms(user, parent_obj)
        # в случае групп брать и на юзера, и для групп
        for permission in permissions:
            new_permission = get_filter_permission_for_obj(permission, obj, parent_obj)
            if new_permission:
                assign_perm(new_permission, user, obj)


# проходится по всем дочерним элементам parent_object и устанавливает в зависимости от role permission для user
def send_permission_in_cascade(parent_object, user, role):
    # links = [field.get_accessor_name() for field in parent_object._meta.get_fields() if
    #          issubclass(type(field), ForeignObjectRel)]
    # for link in links:
    #     objects = getattr(parent_object, link).all()
    #     for object in objects:
    #         print(object)

    collector = Collector(using="default")
    collector.collect([parent_object])
    for objects_all_cascade_model in collector.data.values():
        for obj in objects_all_cascade_model:
            links = [field_name.get_accessor_name() for field_name in obj._meta.get_fields() if
                     issubclass(type(field_name), ForeignObjectRel)]
            for link in links:
                objects_child = getattr(obj, link)
                try:
                    # если несколько объектов, проходимся по ним, если один - устанавливаем уже на него
                    for object_child in objects_child.all():
                        send_permissions_for_one_obj(user, object_child, role)
                except AttributeError:
                    send_permissions_for_one_obj(user, objects_child, role)


# устанавливает permissions (в зависимости от role) на передаваемый object (obj)
def send_permissions_for_one_obj(user, obj, role):
    permissions = create_ready_permission(obj, role)
    send_ready_permission(user, obj, permissions)


# формирует в зависимости от роли набор permissions
def create_ready_permission(obj, role):
    if role.find("viewer") != -1:
        return get_view_permission_for_object(obj)
    elif role.find("user") != -1:
        return get_default_permission_for_object(obj)
    else:
        raise ValidationError('User does not have a group')


# возвращает customers, указанные или все
def get_customers_for_role(role, customers_id):
    if role == "superviewer":
        customers = Customer.objects.all()
    else:
        none = Customer.objects.none()
        for customer_id in customers_id:
            try:
                customer_with_id = Customer.objects.filter(id=customer_id)
                customers = none.union(customer_with_id)
                none = customers
            except ObjectDoesNotExist:
                pass
    return customers


# устанавливает для user в зависимости от роли все permissions для выбранных customers_id
def send_permission_for_role(user, role, customers_id):
    customers = get_customers_for_role(role, customers_id)
    for customer in customers:
        send_permissions_for_one_obj(user, customer, role)
        send_permission_in_cascade(customer, user, role)


# удаление permissions для объекта, который будет удаляться
def del_perm(instance):
    filters = Q(content_type=ContentType.objects.get_for_model(instance),
                object_pk=instance.pk)
    UserObjectPermission.objects.filter(filters).delete()
    GroupObjectPermission.objects.filter(filters).delete()

# если потребуется разграничение по большим сообществам - организациям, к которым принадлежат users

# для групп, которые не основные 4, можно ввести особенное permission для customer,
# по которому их и отслеживать/добавлять данные (условно для понимания,
# какие отвечают за глобальные, а какие за заказчиков)
# Однако, например, функция get_group_permissions для user вернет все его глобальные permission
# во встроенной архитектуре по умолчанию не предусмотрен доступ к обьектам
# + при создании customer можно учитывать доп.переменную, которую вписать в класс юзера (переопределять),
# в которой будет указываться основная группа-организация
# или же не основных групп также будет по одной
# получение через группы глобальных разрешений для проверки на разный уровень доступа к модели
# def return_global_permission(user):
#     return user.get_group_permissions()
#     global_permission = []
#     for group in user.groups:
#         if "special_permission" not in group.permissions:
#             global_permission = global_permission + [group.permissions]
#     return global_permission
# фильтруем глобальные permission под необходимую модель
# def return_global_permission_for_model(user, obj):
#     global_permission_for_model = []
#     all_global_permission = return_global_permission(user)
#     for global_permission in all_global_permission:
#         if global_permission.find(f"{obj._meta.model_name}") != -1:
#             global_permission_for_model = global_permission_for_model + [global_permission]
#     return global_permission_for_model
# определяем, какой тип доступа
# def type_of_permission(global_permission_codename):
# проверяем условное особенное permission в группе, выбираем те групп, в которых они присутствуют,
# и сопоставляем с глобальными permission доступ к объектам в этих группах
# def check_special_permission(user, obj):
#     for group in user.groups:
#         for permission in group.permissions:
#             if permission.codename == "special_permission":
#                 for global_permission_codename in return_global_permission_for_model(user, obj):
#                     assign_perm(global_permission_codename, group, obj)
# установка основных разрешений на объект
#                 assign_perm(f"view_{obj._meta.model_name}", group, obj)
#                 assign_perm(f"add{obj._meta.model_name}", group, obj)
#                 assign_perm(f"delete_{obj._meta.model_name}", group, obj)
#                 assign_perm(f"change_{obj._meta.model_name}", group, obj)
