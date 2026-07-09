import { useEffect, useMemo, useState } from 'react'
import {
  FiSearch,
  FiDownload,
  FiEye,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from 'react-icons/fi'
import Section from '../components/ui/Section.jsx'
import Badge from '../components/ui/Badge.jsx'
import StatReadout from '../components/ui/StatReadout.jsx'
import api from '../services/api'

const STATUS_CONFIG = {
  ready: {
    tone: 'success',
    label: 'Ready',
    icon: FiCheckCircle,
  },
  processing: {
    tone: 'steel',
    label: 'Processing',
    icon: FiClock,
  },
  failed: {
    tone: 'danger',
    label: 'Failed',
    icon: FiAlertCircle,
  },
}

export default function Reports() {
  const [reports, setReports] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)

      const res = await api.get('/reports/')

      setReports(res.data.results || [])
    } catch (err) {
      console.error('Reports Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    return reports.filter(
      (r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.type.toLowerCase().includes(query.toLowerCase())
    )
  }, [reports, query])

  const readyCount = reports.filter(
    (r) => r.status === 'ready'
  ).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatReadout
          label="Total Reports"
          value={reports.length}
          unit="docs"
          icon={FiFileText}
        />

        <StatReadout
          label="Ready"
          value={readyCount}
          unit="docs"
          delta="Available for download"
          deltaTone="success"
          icon={FiCheckCircle}
        />

        <StatReadout
          label="Generated This Month"
          value={reports.length}
          unit="docs"
          delta="+11 vs last month"
          icon={FiClock}
        />
      </div>

      <Section
        eyebrow="Library"
        title="All Reports"
        action={
          <div className="flex items-center gap-2 bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 w-64">
            <FiSearch
              size={14}
              className="text-paper-500 shrink-0"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports..."
              className="bg-transparent outline-none text-sm text-paper-100 placeholder:text-paper-500 w-full"
            />
          </div>
        }
      >
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-ink-600">
                <th className="eyebrow font-normal px-2 py-3">
                  Report
                </th>
                <th className="eyebrow font-normal px-2 py-3">
                  Type
                </th>
                <th className="eyebrow font-normal px-2 py-3">
                  Date
                </th>
                <th className="eyebrow font-normal px-2 py-3">
                  Status
                </th>
                <th className="eyebrow font-normal px-2 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-paper-500"
                  >
                    Loading reports...
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((r) => {
                  const cfg =
                    STATUS_CONFIG[r.status] ||
                    STATUS_CONFIG.ready

                  return (
                    <tr
                      key={r.id}
                      className="border-b border-ink-700 last:border-0 hover:bg-ink-700/40 transition-colors"
                    >
                      <td className="px-2 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-ink-700 border border-ink-600 flex items-center justify-center text-paper-500 shrink-0">
                            <FiFileText size={14} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-paper-100 truncate">
                              {r.name}
                            </p>

                            <p className="readout text-[11px] text-paper-500">
                              {r.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-2 py-3.5 text-paper-500">
                        {r.type}
                      </td>

                      <td className="px-2 py-3.5 readout text-paper-500">
                        {r.date}
                      </td>

                      <td className="px-2 py-3.5">
                        <Badge tone={cfg.tone}>
                          <cfg.icon size={11} />{' '}
                          {cfg.label}
                        </Badge>
                      </td>

                      <td className="px-2 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              window.open(
                                r.download_url,
                                '_blank'
                              )
                            }
                            aria-label={`View ${r.name}`}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-paper-500 hover:text-paper-100 hover:bg-ink-700 transition-colors"
                          >
                            <FiEye size={15} />
                          </button>

                          <button
                            type="button"
                            disabled={
                              r.status !== 'ready'
                            }
                            onClick={() => {
                              if (r.download_url) {
                                window.open(
                                  r.download_url,
                                  '_blank'
                                )
                              }
                            }}
                            aria-label={`Download ${r.name}`}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-paper-500 hover:text-paper-100 hover:bg-ink-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          >
                            <FiDownload size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

              {!loading &&
                filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-paper-500 text-sm"
                    >
                      No reports found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  )
}