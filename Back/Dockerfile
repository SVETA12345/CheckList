FROM python:3.10
ENV PYTHONUNBUFFERED 1
#ADD . /Back
WORKDIR /Back
RUN pip install -r requirements.txt
EXPOSE 5555
USER 0
RUN mkdir -p /files_root/logs/
RUN apt update
run apt install -y libreoffice