# Generated by Django 3.2.22 on 2023-12-25 09:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_newuser_created_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='newuser',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
