from django.contrib import admin
from guardian.admin import GuardedModelAdmin

from .models import Cluster


class ClusterAdmin(GuardedModelAdmin):
    pass


admin.site.register(Cluster, ClusterAdmin)
