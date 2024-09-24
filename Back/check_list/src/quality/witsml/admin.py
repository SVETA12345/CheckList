from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Witsml


class WitsmlAdmin(GuardedModelAdmin):
    pass


admin.site.register(Witsml, WitsmlAdmin)

