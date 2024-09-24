from django.contrib import admin
from guardian.admin import GuardedModelAdmin
from .models import Inform_for_method, Koef_fail, Koef_shod


class Inform_for_methodAdmin(GuardedModelAdmin):
    pass


class Koef_failAdmin(GuardedModelAdmin):
    pass


class Koef_shodAdmin(GuardedModelAdmin):
    pass


admin.site.register(Inform_for_method, Inform_for_methodAdmin)
admin.site.register(Koef_fail, Koef_failAdmin)
admin.site.register(Koef_shod, Koef_shodAdmin)
