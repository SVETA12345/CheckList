from django.db import models


class Types_data(models.TextChoices):
    From_device_memory = 'Из памяти прибора'
    Real_time = 'Реального времени'
    None_value = ''


# проверка типа созданного отчета
class Quality_controlManager(models.Manager):
    def check_created_final_quality(self, pk_wellbore):
        quality_controls = self.filter(wellbore=pk_wellbore, time_deleted__isnull=True)
        for quality_control in quality_controls:
            if Types_data.From_device_memory == quality_control.data_type:
                return True
        return False
