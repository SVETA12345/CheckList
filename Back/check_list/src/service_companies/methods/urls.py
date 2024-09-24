from django.urls import path

from .views import MethodView,MethodALLView, MethodForClassView, SingleMethodView

app_name = "service_companies.method"
urlpatterns = [
    path('methods/<int:pk_service>', MethodView.as_view()),
    path('methods/class/<int:pk_class_method>', MethodForClassView.as_view()),
    path('methods/', MethodALLView.as_view()),
    path('methods/id/<int:pk>', SingleMethodView.as_view()),
]
