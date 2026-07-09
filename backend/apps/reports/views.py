from django.http import FileResponse, Http404
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import filters, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsOwnerOrAdmin
from apps.common.pagination import StandardResultsPagination

from .models import Report
from .serializers import ReportGenerateSerializer, ReportSerializer
from .services import generate_report_pdf


@extend_schema(tags=['Reports'])
class ReportListView(generics.ListAPIView):
    """GET /api/reports/ — list all reports with search, filter & pagination."""

    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['report_type', 'status']
    search_fields = ['title', 'reference', 'report_type']
    ordering_fields = ['generated_at', 'title']
    ordering = ['-generated_at']
    queryset = Report.objects.select_related('generated_by').all()


@extend_schema(tags=['Reports'])
class ReportGenerateView(APIView):
    """POST /api/reports/generate/ — create a new report and render its PDF synchronously."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ReportGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        report = Report.objects.create(
            title=serializer.validated_data['title'],
            report_type=serializer.validated_data['report_type'],
            summary=serializer.validated_data.get('summary', ''),
            generated_by=request.user,
        )
        generate_report_pdf(report)

        return Response(
            ReportSerializer(report, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=['Reports'])
class ReportDetailView(generics.RetrieveDestroyAPIView):
    """GET/DELETE /api/reports/<reference>/"""

    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    lookup_field = 'reference'
    lookup_url_kwarg = 'reference'
    queryset = Report.objects.select_related('generated_by').all()


@extend_schema(tags=['Reports'])
class ReportDownloadView(APIView):
    """GET /api/reports/download/<reference>/ — stream the generated PDF."""

    permission_classes = [IsAuthenticated]

    def get(self, request, reference):
        try:
            report = Report.objects.get(reference=reference)
        except Report.DoesNotExist:
            raise Http404('Report not found.')

        if report.status != 'ready' or not report.file:
            return Response(
                {'detail': 'Report is not ready for download yet.'},
                status=status.HTTP_409_CONFLICT,
            )

        return FileResponse(
            report.file.open('rb'),
            as_attachment=True,
            filename=f'{report.reference}.pdf',
            content_type='application/pdf',
        )
