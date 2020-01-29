from django.db import models

# Create your models here.

class BalRec(models.Model):
    date = models.DateField()
    recType = models.PositiveIntegerField()
    disType = models.PositiveIntegerField()
    income = models.FloatField()
    outcome = models.FloatField()
    detail = models.CharField(max_length=255)
