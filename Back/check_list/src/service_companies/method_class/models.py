from django.contrib.postgres.fields import ArrayField
from django.db import models


class Method_class(models.Model):

    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'method_class'
