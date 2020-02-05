from django.db import models

# Create your models here.

class BalRec(models.Model):
    datex = models.DateField()
    recType = models.PositiveIntegerField()
    disType = models.PositiveIntegerField()
    income = models.FloatField()
    output = models.FloatField()
    detail = models.CharField(max_length=255)
    abstract = models.CharField(max_length=100)
