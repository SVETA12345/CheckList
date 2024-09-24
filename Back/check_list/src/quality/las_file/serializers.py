from rest_framework import serializers

from .models import Las_file


class Las_fileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Las_file
        fields = ('quality_control_id', 'cap', 'parametres', 'mnemodescription', 'tabledata', 'las_file_count', 'status')
