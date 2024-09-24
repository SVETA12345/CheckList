from guardian.admin import GuardedModelAdmin
from .models import Quality_control, Sample
from django.contrib import admin


class Quality_controlAdmin(GuardedModelAdmin):
    pass


admin.site.register(Quality_control, Quality_controlAdmin)
admin.site.register(Sample)

