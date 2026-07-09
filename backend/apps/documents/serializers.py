from django.conf import settings
from rest_framework import serializers

from apps.common.utils import format_file_size

from .models import Document
from .services import infer_category, infer_file_type

MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB, matches frontend copy
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt', 'xlsx'}


class DocumentSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    name = serializers.CharField(source='original_name', read_only=True)
    status = serializers.CharField(source='processing_status', read_only=True)
    size_display = serializers.SerializerMethodField()
    uploaded_by_name = serializers.CharField(source='uploaded_by.name', read_only=True)
    url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'name', 'filename', 'original_name', 'file_type', 'size',
            'size_display', 'category', 'uploaded_by', 'uploaded_by_name',
            'status', 'processing_status', 'upload_date', 'updated_at', 'url',
        ]
        read_only_fields = [
            'id', 'filename', 'original_name', 'file_type', 'size',
            'uploaded_by', 'processing_status', 'upload_date', 'updated_at',
        ]

    def get_size_display(self, obj):
        return format_file_size(obj.size)

    def get_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url if obj.file else None


class DocumentUploadSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)

    class Meta:
        model = Document
        fields = ['file', 'category']
        extra_kwargs = {'category': {'required': False}}

    def validate_file(self, value):
        if value.size > MAX_UPLOAD_SIZE:
            raise serializers.ValidationError('File exceeds the 50MB upload limit.')
        ext = value.name.rsplit('.', 1)[-1].lower() if '.' in value.name else ''
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f"Unsupported file type '.{ext}'. Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}."
            )
        return value

    def create(self, validated_data):
        file_obj = validated_data.pop('file')
        request = self.context['request']
        document = Document.objects.create(
            file=file_obj,
            filename=file_obj.name,
            original_name=file_obj.name,
            file_type=infer_file_type(file_obj.name),
            size=file_obj.size,
            category=validated_data.get('category') or infer_category(file_obj.name),
            uploaded_by=request.user,
        )
        return document
