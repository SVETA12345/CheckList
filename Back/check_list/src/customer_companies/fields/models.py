from django.db import models

from ..customers.models import Customer


class Field(models.Model):
    """Месторождение"""
    name = models.CharField(max_length=120, unique=True)
    customer = models.ForeignKey(Customer, related_name='customer_set', on_delete=models.CASCADE)
    time_deleted = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Field'
        verbose_name_plural = 'Fields'
        ordering = ['name']
