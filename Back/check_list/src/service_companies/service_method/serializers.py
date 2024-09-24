from rest_framework import serializers

from .models import Service_method, Service_device


class Service_methodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service_method
        fields = ('id', 'service_id', 'service_device_id', 'method_id')


class Service_deviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service_device
        fields = ('id', 'tool_type')
