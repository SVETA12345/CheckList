from django.urls import path

from .views import SingleMethodClassView, MethodClassView

app_name = "service_companies.method_class"
urlpatterns = [
    path('method_class/', MethodClassView.as_view()),
    path('method_class/<int:pk>', SingleMethodClassView.as_view()),
]
