import { useCallback, useRef, useState } from 'react'
import {
  FiUploadCloud,
  FiFile,
  FiX,
  FiCheckCircle,
  FiLoader,
} from 'react-icons/fi'
import Section from '../components/ui/Section.jsx'
import Badge from '../components/ui/Badge.jsx'
import api from '../services/api'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [category, setCategory] = useState('manual')
  const inputRef = useRef(null)

  const addFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      file,
      status: 'queued',
    }))

    setFiles((prev) => [...incoming, ...prev])
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files)
    }
  }

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const uploadFiles = async () => {
    const queuedFiles = files.filter(
      (f) => f.status === 'queued'
    )

    for (const fileItem of queuedFiles) {
      try {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: 'uploading' }
              : f
          )
        )

        const formData = new FormData()

        formData.append('file', fileItem.file)
        formData.append('category', category)

        await api.post(
          '/documents/upload/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: 'done' }
              : f
          )
        )
      } catch (err) {
        console.error(err)

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: 'queued' }
              : f
          )
        )

        alert(`Failed to upload ${fileItem.name}`)
      }
    }
  }

  const queuedCount = files.filter(
    (f) => f.status === 'queued'
  ).length

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`bracket-frame relative rounded-2xl border-2 border-dashed p-12 text-center transition-colors bg-blueprint ${
          isDragging
            ? 'border-signal-500 bg-signal-500/5'
            : 'border-ink-600 bg-ink-800'
        }`}
      >
        <div className="mx-auto w-14 h-14 rounded-xl bg-ink-700 border border-ink-600 flex items-center justify-center mb-4">
          <FiUploadCloud
            size={24}
            className="text-signal-500"
          />
        </div>

        <h2 className="font-display text-lg font-semibold text-paper-100">
          Drag & drop documents here
        </h2>

        <p className="text-sm text-paper-500 mt-1.5">
          Manuals, SOPs, inspection reports — PDF,
          DOCX, or XLSX.
        </p>

        <div className="mt-4">
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-paper-100"
          >
            <option value="Manual">
              Manual
            </option>
            <option value="SOP">
              SOP
            </option>
            <option value="Inspection">
              Inspection
            </option>
            <option value="Maintenance">
              Maintenance
            </option>
            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            className="inline-flex items-center gap-2 bg-signal-500 hover:bg-signal-600 text-onaccent font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            Choose files
          </button>

          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) =>
              e.target.files &&
              addFiles(e.target.files)
            }
          />
        </div>
      </div>

      <Section
        eyebrow="Queue"
        title={`Files ${
          files.length ? `(${files.length})` : ''
        }`}
        action={
          queuedCount > 0 && (
            <button
              type="button"
              onClick={uploadFiles}
              className="inline-flex items-center gap-2 bg-steel-500 hover:bg-steel-600 text-onaccent font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors"
            >
              Upload {queuedCount} file
              {queuedCount > 1 ? 's' : ''}
            </button>
          )
        }
      >
        {files.length === 0 ? (
          <p className="text-sm text-paper-500 py-6 text-center">
            No files yet. Uploaded documents
            will appear here before processing.
          </p>
        ) : (
          <div className="space-y-2">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 px-4 py-3 bg-ink-700/60 border border-ink-600 rounded-lg"
              >
                <FiFile
                  size={16}
                  className="text-paper-500 shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-paper-100 truncate">
                    {f.name}
                  </p>

                  <p className="readout text-[11px] text-paper-500">
                    {formatSize(f.size)}
                  </p>
                </div>

                {f.status === 'queued' && (
                  <Badge tone="neutral">
                    Queued
                  </Badge>
                )}

                {f.status ===
                  'uploading' && (
                  <Badge tone="steel">
                    <FiLoader
                      size={11}
                      className="animate-spin"
                    />
                    Uploading
                  </Badge>
                )}

                {f.status === 'done' && (
                  <Badge tone="success">
                    <FiCheckCircle size={11} />
                    Indexed
                  </Badge>
                )}

                <button
                  type="button"
                  onClick={() =>
                    removeFile(f.id)
                  }
                  className="text-paper-500 hover:text-danger transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}