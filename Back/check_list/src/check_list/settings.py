"""
Django settings for check_list project.

Generated by 'django-admin startproject' using Django 3.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""
import datetime
import logging
import os
import sys
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
import django
import structlog
from corsheaders.defaults import default_headers
from django.utils import timezone

# SECRET_KEY = os.environ.get("SECRET_KEY")

# DEBUG = int(os.environ.get("DEBUG", default=0))

# 'DJANGO_ALLOWED_HOSTS' should be a single string of hosts with a space between each.
# For example: 'DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]'
# ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ")

BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-lzz90#(_+_10d8!@s2ybdkf^4zie&2!qcbhdf-f8^!&cml_$s7'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'phonenumber_field',
    'guardian',
    'corsheaders',
    'dbbackup',
    'logging_files',
    'customer_companies.customers',
    'customer_companies.fields',
    'customer_companies.wells',
    'customer_companies.wellbores',
    'customer_companies.clusters',
    'service_companies.services',
    'service_companies.methods',
    'service_companies.service_method',
    'service_companies.method_parametrs',
    'service_companies.method_class',
    'customer_companies.petrophysics_table',
    "quality.plan",
    'quality.quality_control',
    'quality.full_inform',
    'quality.digital_data',
    'quality.witsml',
    'quality.las_file',
    'quality.inform_for_method',
    'quality.second_table',
    'authorization_for_check',
    'customer_companies.strata',
    # 'windows_auth'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django_structlog.middlewares.RequestMiddleware',
    'django.contrib.auth.middleware.RemoteUserMiddleware',
    # 'windows_auth.middleware.UserSyncMiddleware',
]

# CORS_ALLOW_HEADERS = default_headers + (
#     'Access-Control-Allow-Headers',
#     'Access-Control-Allow-Credentials',
#     'Access-Control-Allow-Origin',
# )

# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
#
# SECURE_BROWSER_XSS_FILTER = True
# SECURE_SSL_REDIRECT = True


CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

# CORS_ORIGIN_WHITELIST = [
#     'http://10.23.125.176:3000',
#     'http://10.23.125.239:3000',
#     'http://10.23.125.230:3000',
#     'http://10.23.125.144:3000'
# ]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://10.23.125.176:3000",
    "http://10.23.125.239:3000",
    'http://10.23.125.230:3000',
    'http://10.23.125.144:3000'
]

ROOT_URLCONF = 'check_list.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'check_list.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#        'ENGINE': 'django.db.backends.sqlite3',
#        'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        # 'NAME': 'QualityControlDB2',
        'NAME': 'QualityControlDB2Test',
        'USER': 'postgres',
        'PASSWORD': 'sqlp@$$word',
        "HOST": '10.23.125.230',
        # "HOST": '192.168.1.73',
        "PORT": '5432',
    }
}

# DATABASES = {
#      "default": {
#          "ENGINE": os.environ.get("SQL_ENGINE", "django.db.backends.postgresql_psycopg2"),
#          "NAME": os.environ.get("SQL_DATABASE", BASE_DIR / "QualityControlDB"),
#          "USER": os.environ.get("SQL_USER", "user"),
#          "PASSWORD": os.environ.get("SQL_PASSWORD", "password"),
#          "HOST": os.environ.get("SQL_HOST", "localhost"),
#          "PORT": os.environ.get("SQL_PORT", "5432"),
#     }
# }

DBBACKUP_CONNECTORS = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'HOST': '10.23.125.230',
        'NAME': 'QualityControlDB2Test',
        'USER': 'postgres',
        'PASSWORD': 'sqlp@$$word',
    }
}

AUTH_USER_MODEL = "authorization_for_check.User"

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'guardian.backends.ObjectPermissionBackend',
    # "windows_auth.backends.WindowsAuthBackend",
)

# WAUTH_DOMAINS = {
#     "<your domain's NetBIOS Name> (EXAMPLE)": {
#         "SERVER": "<domain FQDN> (example.local)",
#         "SEARCH_SCOPE": "<search scope> (DC=example,DC=local)",
#         "USERNAME": "<bind account username>",
#         "PASSWORD": "<bind account password>",
#     }
# }

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        # 'rest_framework.permissions.IsAuthenticatedOrReadOnly',
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
}

MEDIA_URL = '/dj/files/'
MEDIA_ROOT = os.path.join(BASE_DIR, "files_root")

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

DELTA_DELETE_TIME = 7

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# class TimeFormatter(logging.Formatter):
#     converter = lambda *args: datetime.now(pytz.timezone(TIME_ZONE)).timetuple()
#

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json_formatter": {
            # "()": TimeFormatter,
            "()": structlog.stdlib.ProcessorFormatter,
            "processor": structlog.processors.JSONRenderer(),
        }
    },
    "handlers": {
        "file": {
            "class": "logging.handlers.TimedRotatingFileHandler",
            "formatter": "json_formatter",
            "when": "midnight",
            "backupCount": 365,
            "delay": True,
            "filename": os.getcwd() +'/files_root/' +f"logs/log_file.log{datetime.datetime.now().strftime('%Y-%m-%d')}"
        },
    },
    "loggers": {
        "django_structlog": {
            "handlers": ["file"],
            "level": "INFO",
        },
        "django_structlog_сheck_list": {
            "handlers": ["file"],
            "level": "INFO",
        },
    }
}

structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.processors.TimeStamper(fmt="iso", utc=False),
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        # structlog.processors.ExceptionPrettyPrinter(),
        structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
    ],
    context_class=structlog.threadlocal.wrap_dict(dict),
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)
