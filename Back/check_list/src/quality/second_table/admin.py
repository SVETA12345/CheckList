from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Second_table


class Second_tableAdmin(GuardedModelAdmin):
    pass


admin.site.register(Second_table, Second_tableAdmin)

