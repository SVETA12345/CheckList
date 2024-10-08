import json
import os
from json import JSONDecodeError

from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from authorization_for_check.models import User


# проходится по всем заданным дням и формирует общую информацию логгирования
def range_amount_days(amount_days, date_end):
    log_inform = []
    for i in range(amount_days + 1):
        date_file = date_end - timezone.timedelta(days=i)
        try:
            date_file_str = str(date_file)
            log_inform = log_inform + read_line(date_file_str)
        except FileNotFoundError:
            print('Не нашёл файл!')
            pass

    return log_inform


# считывание файла логгирования
def read_line(date_file_str=""):
    log_inform_file = []
    for line in open(os.getcwd() + f'/check_list/src/files_root/logs/log_file.log{date_file_str}'):
        log_request = json.loads(line, strict=False)
        try:
            if log_request["event"] == "request_finished":
                try:
                    user = User.objects.get(id=log_request["user_id"])
                    user_login = user.username
                    user_name = f"{user.first_name} {user.last_name}"
                except ObjectDoesNotExist:
                    user_login = "unknown"
                    user_name = "unknown"
                log_request.update({"user_name": user_name, "user_login": user_login})
                response_keys = ["user_id", "user_name", "user_login", "request", "timestamp", "level"]
                log_inform_file.append({key: value for key, value in log_request.items() if key in response_keys})
        except JSONDecodeError:
            with open(f'files_root/logs/error_file.log{date_file_str}', 'w') as f:
                f.seek(0, 2)
                f.write(line)

    return log_inform_file