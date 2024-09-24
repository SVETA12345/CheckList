from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import CheckConstraint, Q
from django.core.exceptions import ObjectDoesNotExist
from quality.quality_control.models import Quality_control
from service_companies.service_method.models import Service_method


class Inform_for_method(models.Model):
    class Types(models.TextChoices):
        Low_realtime_data_density = 'Низкая плотность данных реального времени'
        Realtime_data_transmission = 'Проблема с передачей данных реального времени'
        Recalculation_data_from_device_memory = 'Перерасчет данных из памяти прибора'
        None_value = ''

    Types_task = ['Выделение коллекторов', 'Определение характера насыщения', 'Определение Кп',
                  'Определение Кнг', 'Литологическое расчленение']

    quality_control = models.ForeignKey(Quality_control, related_name='quality_control_set',
                                        on_delete=models.CASCADE)
    service_method = models.ForeignKey(Service_method, related_name='inform_for_method_set', on_delete=models.CASCADE)
    tool_num = models.CharField(max_length=120)
    calibr_date = models.DateField(null=True, blank=True)
    interval_shod_start = models.FloatField(null=True, blank=True)
    interval_shod_end = models.FloatField(null=True, blank=True)
    reason_rashod = models.CharField(max_length=120, choices=Types.choices, blank=True)
    petrophysic_task = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(1.0)], blank=True,
                                         null=True)
    petrophysic_selected = ArrayField(models.CharField(max_length=120, blank=True),
                                      blank=True, default=list)
    method_value = models.FloatField(null=True, blank=True)

    time_deleted = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.petrophysic_selected is not list:
            new_petrophysic_selected = [petrophysic_type_of_task for petrophysic_type_of_task
                                        in self.petrophysic_selected if petrophysic_type_of_task in self.Types_task]
            # for petrophysic_type_of_task in self.petrophysic_selected:
            #     if petrophysic_type_of_task not in self.Types_task:
            #         self.petrophysic_selected = None
            if len(new_petrophysic_selected) == 0:
                self.petrophysic_selected = []
            else:
                self.petrophysic_selected = new_petrophysic_selected

        # if self.time_deleted is not None:
        # self.quality_control.time_deleted = self.time_deleted
        # self.quality_control.
        try:
            quality_control = Quality_control.objects.get(id=self.quality_control.pk)
            quality_control.time_deleted = self.time_deleted
            quality_control.save()
        except ObjectDoesNotExist:
            pass

        return super(Inform_for_method, self).save(*args, **kwargs)

    class Meta:
        db_table = 'quality_Method1'
        constraints = (
            # for checking in the DB
            CheckConstraint(
                check=Q(petrophysic_task__gte=0.0) & Q(petrophysic_task__lte=1.0),
                name='inform_for_method_petrophysic_task_range'),)


class Koef_fail(models.Model):
    koef_fail = models.FloatField(null=True, blank=True)
    inform_for_method = models.OneToOneField(Inform_for_method, related_name='inform_for_koef_fail_set',
                                             on_delete=models.CASCADE, primary_key=True, unique=True)


class Koef_shod(models.Model):
    koef_shod = models.FloatField(null=True, blank=True)
    inform_for_method = models.OneToOneField(Inform_for_method, related_name='inform_for_koef_shod_set',
                                             on_delete=models.CASCADE, primary_key=True, unique=True)
