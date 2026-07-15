import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";

import Section from "../components/ui/Section.jsx";
import api from "../services/api";

export default function Reports() {
  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await api.get("/documents/");
      setDocuments(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return documents.filter((doc) =>
      doc.original_name.toLowerCase().includes(query.toLowerCase())
    );
  }, [documents, query]);

  return (
    <div className="space-y-6">

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="rounded-xl border border-ink-700 bg-ink-800 p-6">
          <h2 className="text-3xl font-bold text-paper-100">
            {documents.length}
          </h2>

          <p className="text-paper-500 mt-2">
            Total Reports
          </p>
        </div>

        <div className="rounded-xl border border-ink-700 bg-ink-800 p-6">
          <h2 className="text-3xl font-bold text-paper-100">
            {
              documents.filter(
                (d) => d.processing_status === "indexed"
              ).length
            }
          </h2>

          <p className="text-paper-500 mt-2">
            Ready
          </p>
        </div>

        <div className="rounded-xl border border-ink-700 bg-ink-800 p-6">
          <h2 className="text-3xl font-bold text-paper-100">
            {
              documents.filter(
                (d) => d.processing_status !== "indexed"
              ).length
            }
          </h2>

          <p className="text-paper-500 mt-2">
            Processing
          </p>
        </div>

      </div>

      <Section
        eyebrow="Reports"
        title="Generated Reports"
        action={
          <div className="flex items-center gap-2 bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 w-64">

            <FiSearch className="text-paper-500" />

            <input
              className="bg-transparent w-full outline-none text-paper-100"
              placeholder="Search reports..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

          </div>
        }
      >

        {loading ? (

          <div className="text-center py-10 text-paper-500">
            Loading...
          </div>

        ) : filtered.length === 0 ? (

          <div className="text-center py-10 text-paper-500">
            No Reports Available
          </div>

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b border-ink-700">

                <th className="text-left py-3">Report</th>

                <th className="text-left py-3">Category</th>

                <th className="text-left py-3">Status</th>

                <th className="text-left py-3">Uploaded</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((doc) => (

                <tr
                  key={doc.id}
                  className="border-b border-ink-700"
                >

                  <td className="py-4">

                    <div className="flex items-center gap-3">

                      <FiFileText />

                      {doc.original_name}

                    </div>

                  </td>

                  <td>{doc.category}</td>

                  <td>

                    {doc.processing_status === "indexed" ? (

                      <span className="flex items-center gap-2 text-green-400">

                        <FiCheckCircle />

                        Ready

                      </span>

                    ) : (

                      doc.processing_status

                    )}

                  </td>

                  <td>{doc.upload_date?.substring(0, 10)}</td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </Section>

    </div>
  );
}