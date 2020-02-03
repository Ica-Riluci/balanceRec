from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.AddRec.as_view(), name='add'),
    path('query/', views.QueryRec.as_view(), name='query')
]