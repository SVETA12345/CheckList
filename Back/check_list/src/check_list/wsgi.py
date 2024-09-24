"""
WSGI config for check_list project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

# path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# sys.path.append(path)

import os
import sys
import site
from django.core.wsgi import get_wsgi_application
# Add the app’s directory to the PYTHONPATH
# sys.path.append('C:/Users/superuser/Documents/list_check')
# sys.path.append('C:/Users/superuser/Documents/list_check')

path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'check_list.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'check_list.settings')
application = get_wsgi_application()
