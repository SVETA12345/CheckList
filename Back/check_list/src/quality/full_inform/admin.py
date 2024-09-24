from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Full_inform


class Full_informAdmin(GuardedModelAdmin):
    pass


admin.site.register(Full_inform, Full_informAdmin)
