from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Digital_data


class Digital_dataAdmin(GuardedModelAdmin):
    pass


admin.site.register(Digital_data, Digital_dataAdmin)
