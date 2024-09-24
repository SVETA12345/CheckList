from django.urls import path

from .views import Full_informView, SingleFull_informView, Full_informCreateView

app_name = "quality.full_inform"
urlpatterns = [
    path('full_inform/<int:pk_quality_control>', Full_informCreateView.as_view(), name='full_inform_create_view'),
    path('full_inform/', Full_informView.as_view()),
    path('full_inform/id/<int:pk>', SingleFull_informView.as_view(), name='single_full_inform_view'),
]