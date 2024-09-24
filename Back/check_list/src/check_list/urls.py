"""check_list URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('dj/admin/', admin.site.urls),
    path('dj/api/', include('customer_companies.customers.urls')),
    path('dj/api/', include('customer_companies.fields.urls')),
    path('dj/api/', include('customer_companies.strata.urls')),
    path('dj/api/', include('customer_companies.wells.urls')),
    path('dj/api/', include('customer_companies.wellbores.urls')),
    path('dj/api/', include('customer_companies.clusters.urls')),
    path('dj/api/', include('service_companies.services.urls')),
    path('dj/api/', include('service_companies.methods.urls')),
    path('dj/api/', include('service_companies.service_method.urls')),
    path('dj/api/', include('service_companies.method_parametrs.urls')),
    path('dj/api/', include('service_companies.method_class.urls')),
    path('dj/api/', include('customer_companies.petrophysics_table.urls')),
    path('dj/api/', include('quality.plan.urls')),
    path('dj/api/', include('quality.quality_control.urls')),
    path('dj/api/', include('quality.full_inform.urls')),
    path('dj/api/', include('quality.witsml.urls')),
    path('dj/api/', include('quality.las_file.urls')),
    path('dj/api/', include('quality.digital_data.urls')),
    path('dj/api/', include('quality.inform_for_method.urls')),
    path('dj/api/', include('quality.second_table.urls')),
    path('dj/api/', include('logging_files.urls')),
    path('dj/api/', include('authorization_for_check.urls')),
    path('dj/api/', include('dashboard.urls')),
    path('dj/api-auth/', include('rest_framework.urls')),
]
