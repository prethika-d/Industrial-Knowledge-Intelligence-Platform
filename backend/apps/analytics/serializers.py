from rest_framework import serializers

from .models import Analytics


class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = ['id', 'metric_name', 'value', 'unit', 'period', 'dimension', 'delta_label', 'created_at']


class MetricCardSerializer(serializers.Serializer):
    """Matches the frontend's METRICS/STATS card shape exactly."""

    label = serializers.CharField()
    value = serializers.CharField()
    unit = serializers.CharField(required=False, allow_blank=True)
    delta = serializers.CharField(required=False, allow_blank=True)
    delta_tone = serializers.CharField(required=False, allow_blank=True)
    icon = serializers.CharField(required=False, allow_blank=True)


class GrowthPointSerializer(serializers.Serializer):
    """Matches Recharts AreaChart data points: {month, queries, uploads}."""

    month = serializers.CharField()
    queries = serializers.IntegerField()
    uploads = serializers.IntegerField()


class DepartmentUsageSerializer(serializers.Serializer):
    """Matches Recharts BarChart data points: {dept, value}."""

    dept = serializers.CharField()
    value = serializers.IntegerField()
