from django.db import models

from ..fields.models import Field


class Cluster(models.Model):
    """Кусты"""
    name = models.CharField(max_length=120)
    field = models.ForeignKey(Field, related_name='field_set', on_delete=models.CASCADE)
    time_deleted = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Cluster'
        verbose_name_plural = 'Clusters'
        ordering = ['name']

