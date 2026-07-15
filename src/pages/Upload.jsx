import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiUploadCloud,
  FiFile,
  FiX,
  FiCheckCircle,
  FiLoader,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";

import Section from "../components/ui/Section.jsx";
import Badge from "../components/ui/Badge.jsx";
import api from "../services/api";

function formatSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("manual");
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/documents/");

      const docs = res.data.results.map((doc) => ({
        id: doc.id,
        name: doc.original_name,
        size: doc.size,
        status: doc.processing_status,
        uploaded: true,
        uploadDate: doc.upload_date,
        category: doc.category,
      }));

      setFiles(docs);
    } catch (err) {
      console.error("Failed loading documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const addFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList).map((file) => ({
      id: `${file.name}-${Date.now()}`,
      file,
      name: file.name,
      size: file.size,
      status: "queued",
      uploaded: false,
    }));

    setFiles((prev) => [...incoming, ...prev]);
  }, []);

  const uploadFiles = async () => {
    const queue = files.filter(
      (f) => !f.uploaded && f.status === "queued"
    );

    if (!queue.length) return;

    setUploading(true);

    for (const item of queue) {
      try {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: "processing" }
              : f
          )
        );

        const formData = new FormData();

        formData.append("file", item.file);
        formData.append("category", category);

        await api.post("/documents/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

      } catch (err) {
        console.error(err);

        alert(`Failed to upload ${item.name}`);
      }
    }

    await loadDocuments();

    setUploading(false);
  };

  const deleteDocument = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await api.delete(`/documents/${id}/`);

      await loadDocuments();
    } catch (err) {
      console.error(err);

      alert("Unable to delete document.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragging(false);

    if (e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const queuedCount = files.filter(
    (f) => !f.uploaded
  ).length;
    return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-600 bg-gray-900"
        }`}
      >
        <div className="flex justify-center mb-5">
          <FiUploadCloud size={48} className="text-blue-500" />
        </div>

        <h2 className="text-2xl font-bold text-white">
          Upload Industrial Documents
        </h2>

        <p className="text-gray-400 mt-2">
          Upload PDF, DOCX, TXT or XLSX documents.
        </p>

        <div className="mt-6">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          >
            <option value="manual">Manual</option>
            <option value="sop">SOP</option>
            <option value="inspection_report">Inspection Report</option>
            <option value="maintenance">Maintenance</option>
            <option value="safety">Safety</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => inputRef.current.click()}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white"
          >
            Choose Files
          </button>

          <button
            onClick={uploadFiles}
            disabled={!queuedCount || uploading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold text-white"
          >
            {uploading ? "Uploading..." : `Upload (${queuedCount})`}
          </button>

          <button
            onClick={loadDocuments}
            className="bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg"
          >
            <FiRefreshCw />
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Uploaded Documents */}
      <Section
        eyebrow="Knowledge Base"
        title="Uploaded Documents"
      >
        {loading ? (
          <div className="text-center py-10">
            <FiLoader
              className="animate-spin mx-auto text-blue-500"
              size={30}
            />
            <p className="mt-3 text-gray-400">
              Loading documents...
            </p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No uploaded documents.
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-900 border border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <FiFile
                    size={22}
                    className="text-blue-500"
                  />

                  <div>
                    <h3 className="text-white font-medium">
                      {file.name}
                    </h3>

                    <p className="text-sm text-gray-400">
                      {formatSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">

                  {file.status === "queued" && (
                    <Badge tone="neutral">
                      Queued
                    </Badge>
                  )}

                  {file.status === "processing" && (
                    <Badge tone="steel">
                      <FiLoader className="animate-spin mr-1" />
                      Processing
                    </Badge>
                  )}

                  {(file.status === "indexed" ||
                    file.status === "done") && (
                    <Badge tone="success">
                      <FiCheckCircle className="mr-1" />
                      Indexed
                    </Badge>
                  )}

                  <button
                    onClick={() =>
                      deleteDocument(file.id)
                    }
                    className="text-red-500 hover:text-red-400"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}