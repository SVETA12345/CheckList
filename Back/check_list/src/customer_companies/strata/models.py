from django.db import models

from ..fields.models import Field


class Strata(models.Model):
    name = models.CharField(max_length=120)
    field = models.ForeignKey(Field, related_name='field_strata_set', on_delete=models.CASCADE)
    strata_file = models.FileField(blank=True, null=True, default="")
    time_deleted = models.DateTimeField(null=True, blank=True)
    strata_file_name = models.CharField(null=True, max_length=120)
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Strata'
        ordering = ['name']

