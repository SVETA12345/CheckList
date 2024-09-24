from django.urls import path

from .views import Second_tableCreateView, Second_tableView, SingleSecond_tableView

app_name = "quality.second_table"
urlpatterns = [
    path('second_table/<int:pk_inform_for_method>', Second_tableCreateView.as_view()),
    path('second_table/', Second_tableView.as_view()),
    path('second_table/id/<int:pk>', SingleSecond_tableView.as_view()),
]