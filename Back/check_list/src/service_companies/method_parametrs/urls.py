from django.urls import path

from .views import MethodParametrsView, MethodParametrsALLView, SingleMethodParametrsView, SingleMnemonicView, \
    MnemonicDictView, MnemonicView, MnemonicDictFileView

app_name = "service_companies.method_parametrs"
urlpatterns = [
    path('method_parametrs/<int:pk_method>', MethodParametrsView.as_view()),
    path('method_parametrs/', MethodParametrsALLView.as_view()),
    path('method_parametrs/id/<int:pk>', SingleMethodParametrsView.as_view()),
    path('mnemonic/id/<int:pk>', SingleMnemonicView.as_view()),
    path('mnemonic/<int:pk_parametr>', MnemonicView.as_view()),
    path('mnemonic/', MnemonicDictView.as_view()),
    path('mnemonic_file/', MnemonicDictFileView.as_view()),
]
