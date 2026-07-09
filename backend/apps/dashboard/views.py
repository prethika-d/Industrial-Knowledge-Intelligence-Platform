from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.assistant.models import AIConversation
from apps.documents.models import Document
from apps.reports.models import Report

from .models import Activity, SystemStatus
from .serializers import ActivitySerializer, SystemStatusSerializer

User = get_user_model()


@extend_schema(tags=['Dashboard'])
class DashboardStatsView(APIView):
    """GET /api/dashboard/stats/ — headline stat cards for the Dashboard hero grid."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        documents_count = Document.objects.count()
        documents_this_week = Document.objects.filter(
            upload_date__gte=timezone.now() - timedelta(days=7)
        ).count()

        queries_count = AIConversation.objects.count()
        queries_this_week = AIConversation.objects.filter(
            timestamp__gte=timezone.now() - timedelta(days=7)
        ).count()

        reports_count = Report.objects.count()
        reports_this_week = Report.objects.filter(
            generated_at__gte=timezone.now() - timedelta(days=7)
        ).count()

        active_users = User.objects.filter(is_active=True).count()
        total_bytes = sum(Document.objects.values_list('size', flat=True))

        stats = [
            {
                'label': 'Documents Uploaded',
                'value': f'{documents_count:,}',
                'unit': 'files',
                'delta': f'+{documents_this_week} this week',
                'delta_tone': 'success' if documents_this_week else 'neutral',
                'icon': 'file-text',
            },
            {
                'label': 'AI Queries',
                'value': f'{queries_count:,}',
                'unit': 'total',
                'delta': f'+{queries_this_week} this week',
                'delta_tone': 'success' if queries_this_week else 'neutral',
                'icon': 'message-square',
            },
            {
                'label': 'Reports Generated',
                'value': f'{reports_count:,}',
                'unit': 'reports',
                'delta': f'+{reports_this_week} this week',
                'delta_tone': 'success' if reports_this_week else 'neutral',
                'icon': 'bar-chart-2',
            },
            {
                'label': 'Active Users',
                'value': f'{active_users:,}',
                'unit': 'users',
                'delta': '',
                'delta_tone': 'neutral',
                'icon': 'cpu',
            },
        ]

        system_health = 'Operational'
        if SystemStatus.objects.filter(status='Down').exists():
            system_health = 'Down'
        elif SystemStatus.objects.filter(status='Degraded').exists():
            system_health = 'Degraded'

        return Response({
            'stats': stats,
            'documents_processed': documents_count,
            'reports_generated': reports_count,
            'active_users': active_users,
            'ai_query_count': queries_count,
            'system_health': system_health,
            'storage_usage_bytes': total_bytes,
        })


@extend_schema(tags=['Dashboard'])
class SystemStatusView(APIView):
    """GET /api/dashboard/system-status/ — list of monitored services & their health."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        statuses = SystemStatus.objects.all()
        return Response({'systems': SystemStatusSerializer(statuses, many=True).data})


@extend_schema(tags=['Dashboard'])
class ActivityFeedView(APIView):
    """GET /api/dashboard/activity-feed/ — recent platform activity log."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        activities = Activity.objects.all()[:limit]
        return Response({'activity': ActivitySerializer(activities, many=True).data})
