FROM python:3.10
ENV PYTHONUNBUFFERED 1
ADD . /backend
WORKDIR /backend
RUN pip install -r requirements.txt
EXPOSE 5555
USER 0
RUN mkdir -p check_list/src/files_root/logs
RUN chmod g+w,o+rwx check_list/src/files_root/logs
RUN apt update
run apt install -y libreoffice