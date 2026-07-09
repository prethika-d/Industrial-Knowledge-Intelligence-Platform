"""
Service layer for document ingestion.

In production this is where text extraction, chunking, and vector-indexing
into the knowledge base would happen (e.g. via LangChain + a vector store).
For now it synchronously flips the document to PROCESSING then INDEXED so
the frontend's status badges (Queued -> Uploading -> Indexed) behave
correctly end-to-end.
"""
import mimetypes

from .models import Document, FileType, ProcessingStatus

EXTENSION_TO_FILE_TYPE = {
    'pdf': FileType.PDF,
    'docx': FileType.DOCX,
    'doc': FileType.DOC,
    'txt': FileType.TXT,
    'xlsx': FileType.XLSX,
}


def infer_file_type(filename: str) -> str:
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
    return EXTENSION_TO_FILE_TYPE.get(ext, FileType.TXT)


def infer_category(filename: str) -> str:
    lowered = filename.lower()
    if 'sop' in lowered:
        return 'sop'
    if 'safety' in lowered:
        return 'safety'
    if 'inspection' in lowered:
        return 'inspection_report'
    if 'maintenance' in lowered:
        return 'maintenance'
    if 'manual' in lowered:
        return 'manual'
    return 'other'


def process_document(document: Document) -> Document:
    """Simulate the indexing pipeline synchronously. Swap for a Celery task in production."""
    document.processing_status = ProcessingStatus.PROCESSING
    document.save(update_fields=['processing_status', 'updated_at'])

    # Placeholder for real extraction/embedding/indexing logic.
    document.processing_status = ProcessingStatus.INDEXED
    document.save(update_fields=['processing_status', 'updated_at'])
    return document


def guess_mimetype(filename: str) -> str:
    mime, _ = mimetypes.guess_type(filename)
    return mime or 'application/octet-stream'
