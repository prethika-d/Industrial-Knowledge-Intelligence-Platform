import { useEffect, useState } from "react";
import {
  FiFileText,
  FiBarChart2,
  FiDatabase,
} from "react-icons/fi";

import Section from "../components/ui/Section.jsx";
import api from "../services/api";

export default function Analytics() {
  const [documents, setDocuments] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const docs = await api.get("/documents/");
      setDocuments(docs.data.results || []);

      try {
        const reps = await api.get("/reports/");
        setReports(reps.data.results || reps.data || []);
      } catch {
        setReports([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const manuals = documents.filter(
    (d) => d.category === "manual"
  ).length;

  const sops = documents.filter(
    (d) => d.category === "sop"
  ).length;

  const safety = documents.filter(
    (d) => d.category === "safety"
  ).length;

  const maintenance = documents.filter(
    (d) => d.category === "maintenance"
  ).length;

  const others = documents.filter(
    (d) => d.category === "other"
  ).length;

  return (
    <div className="space-y-8">

      {/* Analytics Overview */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="rounded-xl bg-ink-800 border border-ink-700 p-6">
          <FiFileText
            className="text-signal-500 mb-3"
            size={30}
          />

          <h2 className="text-4xl font-bold text-paper-100">
            {documents.length}
          </h2>

          <p className="text-paper-500 mt-2">
            Total Documents
          </p>
        </div>

        <div className="rounded-xl bg-ink-800 border border-ink-700 p-6">
          <FiBarChart2
            className="text-signal-500 mb-3"
            size={30}
          />

          <h2 className="text-4xl font-bold text-paper-100">
            {reports.length}
          </h2>

          <p className="text-paper-500 mt-2">
            Reports Generated
          </p>
        </div>

        <div className="rounded-xl bg-ink-800 border border-ink-700 p-6">
          <FiDatabase
            className="text-signal-500 mb-3"
            size={30}
          />

          <h2 className="text-4xl font-bold text-paper-100">
            {documents.length + reports.length}
          </h2>

          <p className="text-paper-500 mt-2">
            Total Records
          </p>
        </div>

      </div>

      {/* Document Categories */}

      <Section
        eyebrow="Documents"
        title="Uploaded Document Categories"
      >

        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

          <div className="rounded-lg bg-ink-800 border border-ink-700 p-5 text-center">
            <h3 className="text-3xl font-bold text-paper-100">
              {manuals}
            </h3>

            <p className="text-paper-500 mt-2">
              Manuals
            </p>
          </div>

          <div className="rounded-lg bg-ink-800 border border-ink-700 p-5 text-center">
            <h3 className="text-3xl font-bold text-paper-100">
              {sops}
            </h3>

            <p className="text-paper-500 mt-2">
              SOPs
            </p>
          </div>

          <div className="rounded-lg bg-ink-800 border border-ink-700 p-5 text-center">
            <h3 className="text-3xl font-bold text-paper-100">
              {safety}
            </h3>

            <p className="text-paper-500 mt-2">
              Safety
            </p>
          </div>

          <div className="rounded-lg bg-ink-800 border border-ink-700 p-5 text-center">
            <h3 className="text-3xl font-bold text-paper-100">
              {maintenance}
            </h3>

            <p className="text-paper-500 mt-2">
              Maintenance
            </p>
          </div>

          <div className="rounded-lg bg-ink-800 border border-ink-700 p-5 text-center">
            <h3 className="text-3xl font-bold text-paper-100">
              {others}
            </h3>

            <p className="text-paper-500 mt-2">
              Others
            </p>
          </div>

        </div>

      </Section>

      {/* Recent Documents */}

      <Section
        eyebrow="Activity"
        title="Recently Uploaded Documents"
      >

        {documents.length === 0 ? (

          <p className="text-paper-500">
            No documents uploaded yet.
          </p>

        ) : (

          <div className="space-y-4">

            {documents.map((doc) => (

              <div
                key={doc.id}
                className="border-b border-ink-700 pb-3"
              >

                <p className="text-paper-100 font-medium">
                  {doc.original_name}
                </p>

                <p className="text-paper-500 text-sm">
                  Category : {doc.category}
                </p>

                <p className="text-paper-500 text-sm">
                  Status : {doc.processing_status}
                </p>

              </div>

            ))}

          </div>

        )}

      </Section>

    </div>
  );
}