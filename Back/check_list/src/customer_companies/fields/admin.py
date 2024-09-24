from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Field


class FieldAdmin(GuardedModelAdmin):
    pass


admin.site.register(Field, FieldAdmin)
