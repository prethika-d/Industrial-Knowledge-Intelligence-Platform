from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Analytics

# Static presentation metadata for the 4 "hero" metric cards on the Analytics page.
# The frontend's STATS/METRICS arrays hardcode label/icon; we mirror that mapping here
# so the API can return ready-to-render cards without any frontend change.
_OVERVIEW_METRIC_META = {
    'query_accuracy': {'label': 'Query Accuracy', 'unit': '%', 'icon': 'target'},
    'avg_response_time': {'label': 'Avg Response Time', 'unit': 'sec', 'icon': 'clock'},
    'monthly_active_users': {'label': 'Monthly Active Users', 'unit': 'users', 'icon': 'users'},
    'query_growth': {'label': 'Query Growth', 'unit': '%', 'icon': 'trending-up'},
}


@extend_schema(tags=['Analytics'])
class AnalyticsOverviewView(APIView):
    """GET /api/analytics/overview/ — the 4 headline metric cards for the Analytics page."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        cards = []
        for metric_name, meta in _OVERVIEW_METRIC_META.items():
            row = Analytics.objects.filter(metric_name=metric_name, period='current').order_by('-created_at').first()
            cards.append({
                'label': meta['label'],
                'value': _format_value(row.value if row else 0),
                'unit': meta['unit'],
                'delta': row.delta_label if row else '',
                'icon': meta['icon'],
            })
        return Response({'metrics': cards})


@extend_schema(tags=['Analytics'])
class AnalyticsUsageView(APIView):
    """GET /api/analytics/usage/ — department usage breakdown for the horizontal bar chart."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        rows = Analytics.objects.filter(metric_name='department_usage').order_by('-value')
        data = [{'dept': r.dimension, 'value': int(r.value)} for r in rows]
        return Response({'usage_by_department': data})


@extend_schema(tags=['Analytics'])
class AnalyticsChartsView(APIView):
    """GET /api/analytics/charts/ — monthly queries/uploads series for the area chart."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        queries_rows = {r.period: r.value for r in Analytics.objects.filter(metric_name='queries')}
        uploads_rows = {r.period: r.value for r in Analytics.objects.filter(metric_name='uploads')}
        periods = sorted(set(queries_rows) | set(uploads_rows))

        growth = [
            {
                'month': period,
                'queries': int(queries_rows.get(period, 0)),
                'uploads': int(uploads_rows.get(period, 0)),
            }
            for period in periods
        ]
        return Response({'growth': growth})


def _format_value(value):
    if value == int(value):
        return str(int(value))
    return f'{value:.1f}'
