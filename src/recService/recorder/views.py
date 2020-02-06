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
        new_rec = BalRec(datex=create_date, recType=data['type'], disType=data['dist'], income=data['inc'], output=data['out'], detail=data['detail'], abstract=data['abst'])
        new_rec.save()
        return HttpResponse('hello')

class QueryRec(generic.View):
    def post(self, request):
        data = json.loads(request.body)
        print(data)
        ldate = datetime.strptime(data['ldate'], '%Y-%m-%d')
        rdate = datetime.strptime(data['rdate'], '%Y-%m-%d')
        rlist = BalRec.objects.filter(datex__gte=ldate).filter(datex__lte=rdate)
        resp = []
        for rec in rlist:
            resp.append({
                'datex' : rec.datex.strftime('%Y-%m-%d'),
                'rtype' : rec.recType,
                'dtype' : rec.disType,
                'inc' : rec.income,
                'out' : rec.output,
                'detail' : rec.detail,
                'pk' : rec.id,
                'abst' : rec.abstract
            })
        res = {
            'valid' : True,
            'data' : resp
        }
        return HttpResponse(json.dumps(res, ensure_ascii=False), content_type='application/json, charset=utf-8')

class ModifyRec(generic.View):
    def post(self, request):
        pass

class SaveRec(generic.View):
    def post(self, request):
        table = json.loads(request.body)["data"]
        with open('/Users/icariluci/all.csv', 'w+') as f:
            bal = 0
            inc = 0
            out = 0
            f.write('日期,摘要,支出,收入,余额,备注\n')
            for rec in table[0]:
                bal += rec['inc']
                bal -= rec['out']
                inc += rec['inc']
                out += rec['out']
                f.write(','.join([rec['datex'], rec['abst'], str(rec['inc']), str(rec['out']), str(bal), rec['detail']]) + '\n')
            f.write(','.join(['总计', str(bal), str(inc), str(out),'','']) + '\n')
        with open('/Users/icariluci/t1.csv', 'w+') as f:
            bal = 0
            inc = 0
            out = 0
            f.write('日期,摘要,支出,收入,余额,备注\n')
            for rec in table[1]:
                bal += rec['inc']
                bal -= rec['out']
                inc += rec['inc']
                out += rec['out']
                f.write(','.join([rec['datex'], rec['abst'], str(rec['inc']), str(rec['out']), str(bal), rec['detail']]) + '\n')
            f.write(','.join(['总计', str(bal), str(inc), str(out),'','']) + '\n')
        with open('/Users/icariluci/t2.csv', 'w+') as f:
            bal = 0
            inc = 0
            out = 0
            f.write('日期,摘要,支出,收入,余额,备注\n')
            for rec in table[2]:
                bal += rec['inc']
                bal -= rec['out']
                inc += rec['inc']
                out += rec['out']
                f.write(','.join([rec['datex'], rec['abst'], str(rec['inc']), str(rec['out']), str(bal), rec['detail']]) + '\n')
            f.write(','.join(['总计', str(bal), str(inc), str(out),'','']) + '\n')
        return HttpResponse('well')