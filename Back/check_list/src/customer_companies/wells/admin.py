from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Well


class WellAdmin(GuardedModelAdmin):
    pass


admin.site.register(Well, WellAdmin)
