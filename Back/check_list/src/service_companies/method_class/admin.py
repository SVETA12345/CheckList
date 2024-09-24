# from django.contrib import admin
# from guardian.admin import GuardedModelAdmin
#
# from .models import Method
#
#
# class MethodAdmin(GuardedModelAdmin):
#     pass
#
#
# admin.site.register(Method, MethodAdmin)

from django.contrib import admin
from .models import Method_class


admin.site.register(Method_class)