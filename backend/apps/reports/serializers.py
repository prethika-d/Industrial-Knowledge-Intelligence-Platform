from rest_framework import serializers

from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='reference', read_only=True)
    name = serializers.CharField(source='title', read_only=True)
    type = serializers.CharField(source='report_type', read_only=True)
    date = serializers.DateTimeField(source='generated_at', format='%Y-%m-%d', read_only=True)
    generated_by_name = serializers.CharField(source='generated_by.name', read_only=True)
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id', 'name', 'title', 'type', 'report_type', 'status', 'date',
            'generated_at', 'updated_at', 'generated_by', 'generated_by_name',
            'summary', 'download_url',
        ]
        read_only_fields = fields

    def get_download_url(self, obj):
        if obj.status != 'ready' or not obj.file:
            return None
        request = self.context.get('request')
        from django.urls import reverse
        url = reverse('reports:report_download', kwargs={'reference': obj.reference})
        return request.build_absolute_uri(url) if request else url


class ReportGenerateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    report_type = serializers.ChoiceField(choices=Report._meta.get_field('report_type').choices)
    summary = serializers.CharField(required=False, allow_blank=True, default='')
