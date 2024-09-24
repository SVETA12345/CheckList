from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Wellbore


class WellboreAdmin(GuardedModelAdmin):
    pass


admin.site.register(Wellbore, WellboreAdmin)
