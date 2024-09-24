from rest_framework.exceptions import PermissionDenied
from .models import Cluster


class ClusterFullGet:
    def __init__(self, user):
        self.exception = None
        self.data = {}
        self.field = 0
        self.user = user  # для проверки доступа к объекту

    # возвращает параметры объекта field в словаре по pk_field
    def cluster(self, pk_cluster):
        try:
            cluster = Cluster.objects.get(id=pk_cluster)
            if self.user.has_perm('view_cluster', cluster):
                self.data.update({"cluster_id": cluster.pk, "cluster_name": cluster.name})
                if cluster.field is None:
                    self.exception = "Field Does Not Exist"
                    return
                self.field = cluster.field.pk
            else:
                raise PermissionDenied('You do not have permission to perform this action.')
        except Cluster.DoesNotExist:
            self.exception = "Cluster Does Not Exist"
        return
