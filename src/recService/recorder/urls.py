from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.AddRec.as_view(), name='add'),
    path('query/', views.QueryRec.as_view(), name='query'),
    path('save/', views.SaveRecAsFile.as_view(), name='save'),
    path('edit/', views.ModifyRec.as_view(), name='edit'),
    path('retrieve/', views.RetrieveRec.as_view(), name='retrieve'),
    path('delete/', views.DeleteRec.as_view(), name='delete')
]