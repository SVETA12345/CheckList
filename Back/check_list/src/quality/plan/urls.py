from django.urls import path

from .views import *

urlpatterns = [
    path('plan/upload_excel', PlanView.as_view()),
]