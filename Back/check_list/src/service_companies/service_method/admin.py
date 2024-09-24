# from django.contrib import admin
# from guardian.admin import GuardedModelAdmin
#
# from .models import Service_method, Service_device
#
#
# class Service_deviceAdmin(GuardedModelAdmin):
#     pass
#
#
# class Service_methodAdmin(GuardedModelAdmin):
#     pass
#
#
# admin.site.register(Service_method, Service_methodAdmin)
# admin.site.register(Service_device, Service_deviceAdmin)

from django.contrib import admin
from .models import Service_method, Service_device


admin.site.register(Service_method)
admin.site.register(Service_device)