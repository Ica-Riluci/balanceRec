from django.shortcuts import render
from django.http import HttpResponse
from django.views import generic
from .models import BalRec
from datetime import date, datetime
from recService.settings import LOCAL_ADD
import json

# Create your views here.

def set2Resp(l):
    resp = []
    for rec in l:
        resp.append({
            'datex' : rec.datex.strftime('%Y-%m-%d'),
            'rtype' : rec.recType,
            'dtype' : rec.disType,
            'inc' : rec.income,
            'out' : rec.output,
            'detail' : rec.detail,
            'id' : rec.id,
            'abst' : rec.abstract
        })
    return resp

def rtype(x):
    if x == 1:
        return '管理费用'
    return '其他费用'

def dtype(x):
    if x == 1:
        return '仅23号大院'
    if x == 2:
        return '仅175'
    return '23号大院和175'

class AddRec(generic.View):
    def post(self, request):
        data = json.loads(request.body)
        create_date = datetime.strptime(data['datex'], '%Y-%m-%d')
        new_rec = BalRec(datex=create_date, recType=data['type'], disType=data['dist'], income=data['inc'], output=data['out'], detail=data['detail'], abstract=data['abst'])
        new_rec.save()
        return HttpResponse('Insertion success.')

class RetrieveRec(generic.View):
    def post(self, request):
        l = BalRec.objects.all().order_by('datex')
        resp = set2Resp(l)
        r = { 'data' : resp }
        return HttpResponse(json.dumps(r, ensure_ascii=False), content_type='application/json, charset=utf-8')

class QueryRec(generic.View):
    def post(self, request):
        data = json.loads(request.body)
        ldate = datetime.strptime(data['ldate'], '%Y-%m-%d')
        rdate = datetime.strptime(data['rdate'], '%Y-%m-%d')
        l = BalRec.objects.filter(datex__gte=ldate).filter(datex__lte=rdate).order_by('datex')
        resp = set2Resp(l)
        r = { 'data' : resp }
        return HttpResponse(json.dumps(r, ensure_ascii=False), content_type='application/json, charset=utf-8')

class DeleteRec(generic.View):
    def post(self, request):
        data = json.loads(request.body)
        for i in data['todel']:
            BalRec.objects.filter(pk=i).delete()
        return HttpResponse('OK')

class ModifyRec(generic.View):
    def post(self, request):
        data = json.loads(request.body)
        BalRec.objects.filter(pk=data['pk']).update(
            datex=datetime.strptime(data['datex'], '%Y-%m-%d'),
            recType=data['rectype'],
            disType=data['distype'],
            income=data['inc'],
            output=data['out'],
            detail=data['detail'],
            abstract=data['abstract']
        )
        return HttpResponse('OK')

class SaveRecAsFile(generic.View):
    def post(self, request):
        table = json.loads(request.body)['data']
        addr = LOCAL_ADD + json.loads(request.body)['filename']
        with open(addr, 'w+') as f:
            f.write('日期,摘要,费用类型,报销人,支出,收入,借方余额,备注\n')
            for rec in table:
                f.write(','.join([rec['datex'], rec['abst'],
                                 rtype(rec['rtype']), dtype(rec['dtype']),
                                 str(rec['inc']), str(rec['out']),
                                 str(rec['balance']), rec['detail']]) + '\n')
        return HttpResponse('File Saved')