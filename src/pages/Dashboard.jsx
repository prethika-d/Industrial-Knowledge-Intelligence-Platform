import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiUploadCloud,
  FiFileText,
  FiDatabase,
  FiBarChart2,
} from "react-icons/fi";

import Section from "../components/ui/Section.jsx";
import Badge from "../components/ui/Badge.jsx";
import api from "../services/api";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const docRes = await api.get("/documents/");
      setDocuments(docRes.data.results || []);

      try {
        const reportRes = await api.get("/reports/");
        setReports(reportRes.data.results || reportRes.data || []);
      } catch {
        setReports([]);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-2xl border border-ink-600 bg-ink-800 p-8">
        <Badge tone="signal">Knowledge Base Active</Badge>

        <h1 className="text-4xl font-bold text-paper-100 mt-4">
          Welcome to INDUSMIND AI
        </h1>

        <p className="text-paper-500 mt-3">
          Upload manuals, SOPs and reports, then ask questions using AI.
        </p>

        <div className="flex gap-3 mt-6">
          <Link
            to="/assistant"
            className="bg-signal-500 hover:bg-signal-600 px-4 py-2 rounded-lg text-white flex items-center gap-2"
          >
            Ask AI
            <FiArrowRight />
          </Link>

          <Link
            to="/upload"
            className="border border-ink-600 bg-ink-700 hover:bg-ink-600 px-4 py-2 rounded-lg text-paper-100"
          >
            Upload Document
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-ink-700 bg-ink-800 p-6">
          <FiFileText
            size={30}
            className="text-signal-500 mb-3"
          />

          <h2 className="text-4xl font-bold text-paper-100">
            {documents.length}
          </h2>

          <p className="text-paper-500 mt-2">
            Documents Uploaded
          </p>
        </div>

        <div className="rounded-xl border border-ink-700 bg-ink-800 p-6">
          <FiBarChart2
            size={30}
            className="text-signal-500 mb-3"
          />

          <h2 className="text-4xl font-bold text-paper-100">
            {reports.length}
          </h2>

          <p className="text-paper-500 mt-2">
            Reports Generated
          </p>
        </div>
      </div>

      {/* System + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section
          eyebrow="Status"
          title="System Overview"
        >
          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <FiDatabase className="text-signal-500" />
              <span className="text-paper-100">
                Backend Running
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FiDatabase className="text-signal-500" />
              <span className="text-paper-100">
                AI Provider : Gemini
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FiDatabase className="text-signal-500" />
              <span className="text-paper-100">
                Indexed Documents : {documents.length}
              </span>
            </div>

          </div>
        </Section>

        <Section
          eyebrow="Activity"
          title="Recent Uploads"
        >
          {documents.length === 0 ? (
            <div className="text-center py-10">

              <FiUploadCloud
                size={40}
                className="mx-auto text-paper-500"
              />

              <p className="text-paper-500 mt-4">
                No documents uploaded yet.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border-b border-ink-700 pb-3"
                >
                  <p className="text-paper-100">
                    📄 {doc.original_name}
                  </p>

                  <p className="text-paper-500 text-sm">
                    {doc.upload_date}
                  </p>
                </div>
              ))}

            </div>
          )}
        </Section>
      </div>

      {/* Information */}
      <Section
        eyebrow="Platform"
        title="About INDUSMIND AI"
      >
        <p className="text-paper-500 leading-7">
          INDUSMIND AI allows industries to upload manuals, SOPs,
          maintenance logs, inspection reports and other documents.
          The AI Assistant searches those documents and provides
          accurate answers based on uploaded knowledge.
        </p>
      </Section>
    </div>
  );
}