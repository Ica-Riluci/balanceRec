from django.shortcuts import render
from django.http import HttpResponse
from django.views import generic
from .models import BalRec
from datetime import date, datetime
import json

# Create your views here.

class AddRec(generic.View):
    def post(self, request):
        data = json.loads(request.body)
        print(data)
        create_date = datetime.strptime(data['datex'], '%Y-%m-%d')
        new_rec = BalRec(datex=create_date, recType=data['type'], disType=data['dist'], income=data['inc'], output=data['out'], detail=data['detail'])
        new_rec.save()
        return HttpResponse('hello')