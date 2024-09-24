@echo off    

if exist %cd%\list_check (
	echo Pulling list_check
	cd list_check
	git pull
        
) else (
	echo Cloning list_check
	git clone git@10.23.125.227:a_klyusheva/list_check.git
	cd list_check
)

virtualenv venv

cd src

python -m pip install -r requirements.txt
python manage.py runserver 0.0.0.0:5431

pause
exit 
