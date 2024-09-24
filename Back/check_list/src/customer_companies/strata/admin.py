from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Strata


class StrataAdmin(GuardedModelAdmin):
    pass


admin.site.register(Strata, StrataAdmin)
