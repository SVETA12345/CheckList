from django.db import models

from service_companies.method_class.models import Method_class


class Method(models.Model):

    method_class = models.ForeignKey(Method_class, related_name='method_set',
                                     blank=True, null=True,
                                     on_delete=models.CASCADE)

    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'method'
