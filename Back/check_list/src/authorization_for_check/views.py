from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.http import Http404
from guardian.models import UserObjectPermission
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListCreateAPIView, UpdateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import BasePermission
from rest_framework.response import Response

from customer_companies.customers.models import Customer
from customer_companies.customers.serializers import CustomerSerializer
from .models import User
from .serializers import UserSerializer
from .service_logics import send_permission_for_role, clear_all_permission_group, clear_all_permission

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token


# доступ только для superuser
class PermissionOnlyForSuperuser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        # print('data=', request.data)
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        if not user.is_superuser:
            group = user.groups.first()
            if group:
                group_name = group.name
            else:
                group_name = 'User does not have a role'
        else:
            group_name = "superuser"
        # Через created можем отслеживать время создания токена
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'name': user.last_name + " " + user.first_name,
            'email': user.email,
            "role": group_name,
        })


# # доступ только для активных пользователей
# class PermissionOnlyForActiveUser(BasePermission):
#     def has_permission(self, request, view):
#         try:
#             user = User.objects.get(username=request.data['username'])
#         except ObjectDoesNotExist:
#             raise ValidationError('User does not not exist')
#         return user.is_active

#
# # получение JWTToken вместе с ролью пользователя
# class GetSpecialJWT(ObtainJSONWebToken):
#     serializer_class = JSONWebTokenSerializer
#
#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)
#         try:
#             user = User.objects.get(username=self.request.data['username'])
#             if not user.is_superuser:
#                 group = user.groups.first()
#                 if group:
#                     group_name = group.name
#                 else:
#                     group_name = 'User does not have a role'
#             else:
#                 group_name = "superuser"
#             response.data.update({"role": group_name, "name": user.last_name + " " + user.first_name})
#         except ObjectDoesNotExist:
#             raise ValidationError('User does not not exist')
#         return response


# изменение пароля
class ChangePasswordUserView(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [PermissionOnlyForSuperuser, ]

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        user.set_password(self.request.data.get("password"))
        user.save()
        return Response(UserSerializer(user).data)


# изменение permissions (либо superuser, либо группа) и удаление старых permissions
class ChangeCustomerPermissionsForUserView(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [PermissionOnlyForSuperuser, ]

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        role = self.request.data.get("role")
        customers = self.request.data.get("customers")
        is_superuser = role == "superuser"
        if is_superuser and not user.is_superuser:
            clear_all_permission_group(user)
            user.is_superuser = is_superuser
        # password = make_password()
        if not is_superuser:
            try:
                group = Group.objects.get(name=role)
                if not user.groups.filter(name=role).exists():
                    clear_all_permission_group(user)
                    user.groups.add(group)
            except ObjectDoesNotExist:
                raise ValidationError('User does not have a role')
            if len(customers) != 0:
                clear_all_permission(user)
                send_permission_for_role(user, role, customers)
        user.save()
        return Response('OK', content_type='text/html', status=200)


# изменение какой-либо информации о user / получение объекта / удаление объекта и всех permissions
class ChangeInformUserView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [PermissionOnlyForSuperuser, ]

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            clear_all_permission_group(instance)
            self.perform_destroy(instance)
        except Http404:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)


# получение списка / создание user
class UserView(ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [PermissionOnlyForSuperuser, ]

    # получение queryset из User
    def get_queryset(self):
        try:
            queryset = User.objects.exclude(username="AnonymousUser")
        except ObjectDoesNotExist:
            queryset = User.objects.none()
        return queryset

    # выполнение создания User: записывается указанная роль, записываются permissions
    def perform_create(self, serializer):
        role = self.request.data.get("role")
        customers = self.request.data.get("customers")
        is_superuser = role == "superuser"
        password = self.request.data.get("password")
        if password:
            if not is_superuser:
                try:
                    group = Group.objects.get(name=role)
                    user = serializer.save(is_superuser=is_superuser)
                    user.groups.add(group)
                    send_permission_for_role(user, role, customers)
                # password = make_password()
                except ObjectDoesNotExist:
                    raise ValidationError('User does not have a role')
            user = serializer.save(is_superuser=is_superuser)
            user.set_password(password)
            user.save()
            return user
        else:
            raise ValidationError('Password not set')

    # получение списка user с получение информации о роли (которая или superuser, или определяется группой)
    def get(self, request, *args, **kwargs):
        response = []
        for user in self.get_queryset():
            filters = Q(content_type=ContentType.objects.get_for_model(Customer),
                        user=user.pk)
            customers = []
            userdict = UserSerializer(user).data
            if userdict["is_superuser"]:
                group = "superuser"
            else:
                try:
                    group = Group.objects.get(id=userdict["groups"][0]).name
                    for object_permission in UserObjectPermission.objects.filter(filters):
                        if object_permission.permission.codename == "view_customer":
                            try:
                                customer = Customer.objects.get(id=object_permission.object_pk)
                                customers = customers + [CustomerSerializer(customer).data]
                            except ObjectDoesNotExist:
                                pass
                except ObjectDoesNotExist:
                    group = "User does not have a role"
            userdict.update({"role": group, "customers": customers})
            del userdict["groups"]
            response = response + [userdict]
        return Response(response)
