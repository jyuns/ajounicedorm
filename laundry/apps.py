from django.apps import AppConfig


class LaundryConfig(AppConfig):
    name = 'laundry'

    def ready(self):
        from .mqtt import mqttc
        mqttc.loop_start()
