from django.db import models


class Service(models.Model):
    name = models.CharField(max_length=120, unique=True)
    short = models.CharField(max_length=120, unique=True, null=True, blank=True)
    time_deleted = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Service'
        verbose_name_plural = 'Services'
        ordering = ['name']
