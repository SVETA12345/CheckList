from django.db import models


class Service_deviceManager(models.Manager):

    def filter_service(self, service_methods):
        return self.filter(id__in=service_methods)


class Service_methodsManager(models.Manager):

    def filter_for_device(self, pk_service, pk_method):
        return self.filter(service=pk_service).filter(method=pk_method).filter(time_deleted__isnull=True).\
            values('service_device')

    def filter_for_method(self, pk_service):
        return self.filter(service=pk_service).filter(time_deleted__isnull=True).values('method')

    def filter_for_all_information(self, pk):
        return self.filter(id__in=pk).values()