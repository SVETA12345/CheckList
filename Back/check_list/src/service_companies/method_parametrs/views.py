import os

from django.core.exceptions import ObjectDoesNotExist
from guardian.shortcuts import get_objects_for_user
from rest_framework import status
from rest_framework.generics import ListAPIView, get_object_or_404, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Method_parametrs, Mnemonic
from .serializers import Method_parametrsSerializer, MnemonicSerializer
from ..method_class.models import Method_class
from ..method_class.serializers import Method_classSerializer

from ..methods.models import Method
from ..methods.serializers import MethodSerializer


class MethodParametrsView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    # возвращает список параметров для метода pk_method
    serializer_class = Method_parametrsSerializer

    def get_queryset(self):
        method = get_object_or_404(Method, id=self.kwargs.get('pk_method'))
        # if self.request.user.has_perm('view_service', service):
        #     try:
        #         service_methods = get_objects_for_user(self.request.user, ['view_service_method'], Service_method,
        #                                                accept_global_perms=False).filter(service=service).values(
        #             'method')
        return Method_parametrs.objects.filter(method=method)
        #         queryset = get_objects_for_user(self.request.user, ['methods.view_method']).\
        #             filter(id__in=service_methods)
        #     except ObjectDoesNotExist:
        #         queryset = Method.objects.none()
        # else:
        #     return Method.objects.none()
        # return queryset

    def perform_create(self, serializer):
        try:
            method = Method.objects.get(id=self.request.data.get('method_id'))
        except Method.DoesNotExist:
            method = get_object_or_404(Method, id=self.kwargs.get('pk_method'))

        method_parametrs = serializer.save(method=method)

        return method_parametrs


# возвращает список всех методов
class MethodParametrsALLView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, *args, **kwargs):
        method_parametrs = Method_parametrs.objects.all()
        method_parametrs_list = []

        for method_param in method_parametrs:
            param_dict = Method_parametrsSerializer(method_param).data
            try:
                method = MethodSerializer(Method.objects.get(id=param_dict["method_id"])).data
                method_class_id = method["method_class_id"]
                if method_class_id is not None:
                    method_class = Method_classSerializer(Method_class.objects.get(id=method_class_id)).data
                else:
                    raise Method_class.DoesNotExist
            except Method.DoesNotExist:
                method = Method.objects.none()
            except Method_class.DoesNotExist:
                method_class = Method_class.objects.none()
            param_dict["method"] = method
            param_dict["method_class"] = method_class
            method_parametrs_list.append(param_dict)

        return Response(method_parametrs_list)


# возвращает/удаляет/изменяет объект Method_parametrs
class SingleMethodParametrsView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = Method_parametrsSerializer
    queryset = Method_parametrs.objects.all()


# возвращает/удаляет/изменяет объект Method_parametrs
class SingleMnemonicView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MnemonicSerializer
    queryset = Mnemonic.objects.all()

    def perform_update(self, serializer):
        try:
            mnemonic = Mnemonic.objects.get(**serializer.validated_data)
        except ObjectDoesNotExist:
            mnemonic = serializer.save()
        return mnemonic

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        response_data = self.serializer_class(self.perform_update(serializer))

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(response_data.data)


class MnemonicView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    # возвращает список параметров для метода pk_method
    serializer_class = MnemonicSerializer

    def get_queryset(self):
        try:
            queryset = Mnemonic.objects.filter(method_parametr=self.kwargs.get('pk_parametr'))
        except ObjectDoesNotExist:
            queryset = Mnemonic.objects.none()
        return queryset

    def perform_create(self, serializer):
        try:
            method_parametr = Method_parametrs.objects.get(id=self.request.data.get('method_parametr_id'))
        except Method_parametrs.DoesNotExist:
            method_parametr = get_object_or_404(Method_parametrs, id=self.kwargs.get('pk_parametr'))
        try:
            mnemonic = Mnemonic.objects.get(name=serializer.validated_data["name"], method_parametr=method_parametr)
        except ObjectDoesNotExist:
            mnemonic = serializer.save(method_parametr=method_parametr)
        return mnemonic

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response_data = self.serializer_class(self.perform_create(serializer))
        headers = self.get_success_headers(serializer.data)
        return Response(response_data.data, status=status.HTTP_201_CREATED, headers=headers)


class MnemonicDictView(APIView):
    permission_classes = [IsAuthenticated]

    def get_response(self):
        response = {}
        method_parametrs = Method_parametrs.objects.all()
        for method_parametr in method_parametrs:
            mnemonics = Mnemonic.objects.filter(method_parametr=method_parametr.pk)
            response.update({method_parametr.abbreviation: [mnemonic.name for mnemonic in mnemonics]})
        return response

    def get(self, request, format=None):
        return Response(self.get_response())


class MnemonicDictFileView(MnemonicDictView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        name = "mnemonics.json"
        response = self.get_response()
        print("{}\\check_list\\src\\files_root\\{}".format(os.getcwd(), name))
        dict_file = open("{}\\check_list\\src\\files_root\\{}".format(os.getcwd(), name), "w+")
        dict_file.write(str(response))
        dict_file.close()
        return Response({"file": name})