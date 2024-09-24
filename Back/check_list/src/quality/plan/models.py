from django.db import models


# Create your models here.

class PlanStata(models.Model):
    year = models.IntegerField(default=2024)
    month = models.IntegerField()
    count_report = models.IntegerField(null=True)



    class Meta:
        db_table = 'quality_Plan'
        verbose_name = 'План'
        verbose_name_plural = 'План'