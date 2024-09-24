from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Las_file


class Las_fileAdmin(GuardedModelAdmin):
    pass


admin.site.register(Las_file, Las_fileAdmin)
