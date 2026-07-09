from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import filters, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import IsOwnerOrAdmin
from apps.common.pagination import StandardResultsPagination

from .models import Document
from .serializers import DocumentSerializer, DocumentUploadSerializer
from .services import process_document


@extend_schema(tags=['Documents'])
class DocumentUploadView(generics.CreateAPIView):
    """POST /api/documents/upload/ — upload a PDF/DOCX/TXT/XLSX document."""

    serializer_class = DocumentUploadSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        document = serializer.save()
        process_document(document)
        output = DocumentSerializer(document, context={'request': request})
        return Response(output.data, status=status.HTTP_201_CREATED)


@extend_schema(tags=['Documents'])
class DocumentListView(generics.ListAPIView):
    """GET /api/documents/ — list documents with search, filter, ordering & pagination."""

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'processing_status', 'file_type']
    search_fields = ['original_name', 'filename']
    ordering_fields = ['upload_date', 'size', 'original_name']
    ordering = ['-upload_date']

    def get_queryset(self):
        qs = Document.objects.select_related('uploaded_by').all()
        if self.request.user.role == 'viewer':
            return qs
        return qs


@extend_schema(tags=['Documents'])
class DocumentDetailView(generics.RetrieveDestroyAPIView):
    """GET/DELETE /api/documents/<id>/"""

    queryset = Document.objects.select_related('uploaded_by').all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    lookup_field = 'id'
