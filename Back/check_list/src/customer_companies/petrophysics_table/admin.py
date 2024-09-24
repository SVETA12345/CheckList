from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Petrophysics_table


class Petrophysics_tableAdmin(GuardedModelAdmin):
    pass


admin.site.register(Petrophysics_table, Petrophysics_tableAdmin)
