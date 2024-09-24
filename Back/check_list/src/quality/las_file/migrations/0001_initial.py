# Generated by Django 4.0.3 on 2024-02-01 11:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('quality_control', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Las_file',
            fields=[
                ('quality_control', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='las_file_set', serialize=False, to='quality_control.quality_control')),
                ('cap', models.CharField(blank=True, choices=[('Полная', 'Full'), ('Частичная', 'Partial'), ('Отсутствует', 'Absent'), ('', 'None Value')], max_length=120)),
                ('parametres', models.CharField(blank=True, choices=[('Полная', 'Full'), ('Частичная', 'Partial'), ('Отсутствует', 'Absent'), ('', 'None Value')], max_length=120)),
                ('mnemodescription', models.CharField(blank=True, choices=[('Полная', 'Full'), ('Частичная', 'Partial'), ('Отсутствует', 'Absent'), ('', 'None Value')], max_length=120)),
                ('tabledata', models.CharField(blank=True, choices=[('Полная', 'Full'), ('Частичная', 'Partial'), ('Отсутствует', 'Absent'), ('', 'None Value')], max_length=120)),
                ('las_file_count', models.FloatField(blank=True, null=True)),
                ('status', models.BooleanField(blank=True, default=True, null=True)),
            ],
            options={
                'verbose_name': 'File',
                'verbose_name_plural': 'Files',
            },
        ),
    ]
