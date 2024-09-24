from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_objects_for_user
from rest_framework.generics import ListAPIView, get_object_or_404, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated

from .models import Method
from .serializers import MethodSerializer
from ..method_class.models import Method_class
from ..service_method.models import Service_method
from ..services.models import Service



class MethodForClassView(ListCreateAPIView):
    # возвращает список параметров для метода pk_method
    serializer_class = MethodSerializer

    def get_queryset(self):
        method_class = get_object_or_404(Method_class, id=self.kwargs.get('pk_class_method'))

        return Method.objects.filter(method_class=method_class)

    def perform_create(self, serializer):
        try:
            class_method = Method_class.objects.get(id=self.request.data.get('method_class_id'))
        except Method_class.DoesNotExist:
            class_method = get_object_or_404(Method_class, id=self.kwargs.get('pk_class_method'))

        method = serializer.save(method_class=class_method)

        return method


# возвращает/удаляет/изменяет объект Method
class SingleMethodView(RetrieveUpdateDestroyAPIView):
    serializer_class = MethodSerializer
    queryset = Method.objects.all()


# возвращает список методов для pk_service
class MethodView(ListAPIView):
    serializer_class = MethodSerializer

    def get_queryset(self):
        service = get_object_or_404(Service, id=self.kwargs.get('pk_service'), time_deleted__isnull=True)
        service_methods = Service_method.objects.filter(time_deleted__isnull=True).\
            filter(service=service).values('method')
        # if self.request.user.has_perm('view_service', service):
        #     try:
        #         service_methods = get_objects_for_user(self.request.user, ['view_service_method'], Service_method,
        #                                                accept_global_perms=False).filter(service=service).values(
        #             'method')
        return Method.objects.filter(id__in=service_methods)
        #         queryset = get_objects_for_user(self.request.user, ['methods.view_method']).\
        #             filter(id__in=service_methods)
        #     except ObjectDoesNotExist:
        #         queryset = Method.objects.none()
        # else:
        #     return Method.objects.none()
        # return queryset


# возвращает список всех методов
class MethodALLView(ListAPIView):
    queryset = Method.objects.all()
    serializer_class = MethodSerializer
    # permission_classes = [DjangoObjectPermissions, IsAuthenticated]

    # def get_queryset(self):
    #     try:
    #         queryset = get_objects_for_user(self.request.user, ['methods.view_method'])
    #     except ObjectDoesNotExist:
    #         queryset = Method.objects.none()
    #     return queryset
