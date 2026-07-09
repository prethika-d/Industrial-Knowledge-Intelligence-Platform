from rest_framework import serializers

from .models import Activity, SystemStatus

_ACTION_ICON_MAP = {
    'upload': 'upload-cloud',
    'query_resolved': 'message-square',
    'report_generated': 'check-circle',
    'document_indexed': 'upload-cloud',
    'login': 'user',
    'other': 'activity',
}


class SystemStatusSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='service_name', read_only=True)
    latency = serializers.SerializerMethodField()

    class Meta:
        model = SystemStatus
        fields = [
            'name', 'service_name', 'status', 'latency', 'latency_ms',
            'uptime_percentage', 'health_percentage', 'updated_at',
        ]

    def get_latency(self, obj):
        return f'{obj.latency_ms}ms'


class ActivitySerializer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['id', 'action', 'icon', 'text', 'time', 'timestamp', 'metadata', 'user']

    def get_icon(self, obj):
        return _ACTION_ICON_MAP.get(obj.action, 'activity')

    def get_time(self, obj):
        from apps.common.utils import humanize_timedelta
        return humanize_timedelta(obj.timestamp)


class StatCardSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.CharField()
    unit = serializers.CharField(required=False, allow_blank=True)
    delta = serializers.CharField(required=False, allow_blank=True)
    delta_tone = serializers.CharField(required=False, allow_blank=True)
    icon = serializers.CharField(required=False, allow_blank=True)
