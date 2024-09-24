from django.urls import path

from .views import SingleInform_for_methodView, Koef_failCreateView, Koef_failView, \
    SingleKoef_failView, Koef_shodCreateView, Koef_shodView, SingleKoef_shodView, PutAndPostView, \
    Inform_for_methodListCreateView

app_name = "quality.inform_for_method"
urlpatterns = [
    path('inform_for_method/<int:pk_quality_control>', Inform_for_methodListCreateView.as_view(),
         name='inform_for_method_list_create_view'),
    path('inform_for_method/id/<int:pk>', SingleInform_for_methodView.as_view(),
         name='single_inform_for_method_view'),

    path('koef_fail/<int:pk_inform_for_method>', Koef_failCreateView.as_view(),
         name='koef_fail_create_view'),
    path('koef_fail/', Koef_failView.as_view()),
    path('koef_fail/id/<int:pk>', SingleKoef_failView.as_view(),
         name='single_koef_fail_view'),

    path('koef_shod/<int:pk_inform_for_method>', Koef_shodCreateView.as_view(),
         name='koef_shod_create_view'),
    path('koef_shod/', Koef_shodView.as_view()),
    path('koef_shod/id/<int:pk>', SingleKoef_shodView.as_view(),
         name='single_koef_shod_view'),

    path('inform_for_method/put/<int:pk_quality_control>', PutAndPostView.as_view(),
         name='put_post_inform_method_second_table'),
]