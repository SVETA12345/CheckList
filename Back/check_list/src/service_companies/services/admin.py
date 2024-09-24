# from django.contrib import admin
# from guardian.admin import GuardedModelAdmin
#
# from .models import Service
#
#
# class ServiceAdmin(GuardedModelAdmin):
#     pass
#
#
# admin.site.register(Service, ServiceAdmin)

from django.contrib import admin
from .models import Service


admin.site.register(Service)