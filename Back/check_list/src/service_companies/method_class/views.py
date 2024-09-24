from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_objects_for_user
from rest_framework.generics import ListAPIView, get_object_or_404, ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .models import Method_class
from .serializers import Method_classSerializer
from ..methods.models import Method


class MethodClassView(ListCreateAPIView):
    # возвращает список параметров для метода pk_method
    serializer_class = Method_classSerializer
    queryset = Method_class.objects.all()


# возвращает/удаляет/изменяет объект Method_parametrs
class SingleMethodClassView(RetrieveUpdateDestroyAPIView):
    serializer_class = Method_classSerializer
    queryset = Method_class.objects.all()