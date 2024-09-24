from django.db import models

from .manager import Service_methodsManager, Service_deviceManager
from ..methods.models import Method
from ..services.models import Service


class Service_device(models.Model):
    tool_type = models.CharField(max_length=120, unique=True)
    time_deleted = models.DateTimeField(null=True, blank=True)

    objects_service = Service_deviceManager()
    objects = models.Manager()

    def __str__(self):
        return self.tool_type

    class Meta:
        db_table = 'serviceCompany_Device'


class Service_method(models.Model):
    service = models.ForeignKey(Service, related_name='service_set', on_delete=models.CASCADE)
    service_device = models.ForeignKey(Service_device, related_name='service_device_set', on_delete=models.CASCADE)
    method = models.ForeignKey(Method, related_name='method_set', on_delete=models.CASCADE)
    time_deleted = models.DateTimeField(null=True, blank=True)

    objects_service = Service_methodsManager()
    objects = models.Manager()

    class Meta:
        db_table = 'serviceCompany_ConnectMethod'


