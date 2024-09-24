from django.contrib.postgres.fields import ArrayField
from django.db import models
from service_companies.methods.models import Method


class Method_parametrs(models.Model):
    method = models.ForeignKey(Method, related_name='method_parametrs_set', on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    abbreviation = models.CharField(max_length=120)
    curve_type = models.CharField(max_length=120)
    units = ArrayField(models.CharField(max_length=120, blank=True), blank=True, default=list)
    description = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'method_parametrs'


class Mnemonic(models.Model):
    method_parametr = models.ForeignKey(Method_parametrs, related_name='method_mnem_set', on_delete=models.CASCADE)
    name = models.CharField(max_length=120)

    class Meta:
        db_table = 'method_mnemonic'
