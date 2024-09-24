from django.apps import AppConfig


class QualityControlConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'quality.quality_control'

    # def ready(self):
    #     # Implicitly connect a signal handlers decorated with @receiver.
    #     from . import signals
    #     # Explicitly connect a signal handler.
    #     signals.request_finished.connect(signals.save_pdf_xlsx)