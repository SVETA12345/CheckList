from django.urls import path

from authorization_for_check.views import UserView, ChangePasswordUserView, ChangeInformUserView, \
    ChangeCustomerPermissionsForUserView, CustomAuthToken

app_name = "authorization_for_check"
urlpatterns = [
    path('users/', UserView.as_view()),
    path('password/<int:pk>', ChangePasswordUserView.as_view()),
    path('informations/<int:pk>', ChangeInformUserView.as_view()),
    path('customer_permissions/<int:pk>', ChangeCustomerPermissionsForUserView.as_view()),
    # path('api-jwt-token-auth/', GetSpecialJWT.as_view()),
    # path('api-jwt-token-refresh/', refresh_jwt_token),  # обновление jwttoken
    path('api-token-auth/', CustomAuthToken.as_view())
]