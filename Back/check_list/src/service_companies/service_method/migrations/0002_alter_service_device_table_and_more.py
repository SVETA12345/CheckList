# Generated by Django 4.0.3 on 2024-04-03 12:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('service_method', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='service_device',
            table='ServiceCompany_Device',
        ),
        migrations.AlterModelTable(
            name='service_method',
            table='ServiceCompany_Method',
        ),
    ]
