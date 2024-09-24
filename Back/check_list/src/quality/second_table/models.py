from django.db import models

from quality.inform_for_method.models import Inform_for_method


class Second_table(models.Model):
    class Linkage(models.TextChoices):
        Related = 'Увязан'
        Partially_unrelated = 'Частично неувязан'
        Unrelated = 'Неувязан'
        None_value = ''

    class Emissions(models.TextChoices):
        Absent = 'Отсутствуют'
        Single = 'Единичные'
        Regular = 'Регулярные'
        None_value = ''

    class Noise(models.TextChoices):
        Absent = 'Отсутствует'
        Insignificant = 'Незначительная'
        High = 'Высокая'
        None_value = ''

    class Control(models.TextChoices):
        To_basic_measurement = 'Соответствует основному замеру'
        Canceled = 'Отменена по согласованию сторон'
        Does_not_match = 'Не соответствует основной записи'
        Not_produced = 'Не произведена'
        None_value = ''

    class Distribute_support(models.TextChoices):
        Corresponds = 'Соответствует данным опорных скважин'
        Underestimated = 'Не соответствует данным опорных скважин (занижено)'
        Overestimated = 'Не соответствует данным опорных скважин (завышено)'
        None_value = ''

    class Distribute_palet(models.TextChoices):
        Are_in = 'Лежат в области ожидаемых значений'
        Are_not_in = 'Не лежат в области ожидаемых значений'
        None_value = ''

    class Instrument_readings_investigated_section(models.TextChoices):
        match = 'Соответствуют'
        not_match = 'Не соответствуют'
        None_value = ''

    class Corresponse(models.TextChoices):
        Match = 'Соответствуют'
        Underestimated = 'Занижены'
        Оverestimated = 'Завышены'
        Not_revealed = 'Реперные горизонты не вскрыты'
        No_reference_horizon_properties = 'Свойства реперного горизонта отсутствуют'
        Diverge = 'Свойства реперного горизонта расходятся'
        None_value = ''

    class Device_tech_condition(models.TextChoices):
        Good = 'Хорошее'
        Satisfactory = 'Удовлетворительное'
        Unsatisfactory = 'Неудовлетворительное'
        None_value = ''

    class Correlation(models.TextChoices):
        Good = 'Коррелируют'
        Satisfactory = 'Частично коррелируют'
        Unsatisfactory = 'Не коррелируют'
        None_value = ''

    inform_for_method = models.OneToOneField(Inform_for_method, on_delete=models.CASCADE, primary_key=True)
    linkage = models.CharField(max_length=120, choices=Linkage.choices, blank=True)
    emissions = models.CharField(max_length=120, choices=Emissions.choices, blank=True)
    noise = models.CharField(max_length=120, choices=Noise.choices, blank=True)
    control = models.CharField(max_length=120, choices=Control.choices, blank=True)
    distribute_support = models.CharField(max_length=120, choices=Distribute_support.choices, blank=True)
    distribute_palet = models.CharField(max_length=120, choices=Distribute_palet.choices, blank=True)
    dash = models.CharField(max_length=120, choices=Instrument_readings_investigated_section.choices, blank=True)
    corresponse = models.CharField(max_length=120, choices=Corresponse.choices, blank=True)
    correlation = models.CharField(max_length=120, choices=Correlation.choices, blank=True)
    device_tech_condition = models.CharField(max_length=120, choices=Device_tech_condition.choices, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'quality_Method2'
