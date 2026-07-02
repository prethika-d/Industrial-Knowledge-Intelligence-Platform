import { useMemo, useState } from 'react'
import { FiSearch, FiDownload, FiEye, FiFileText } from 'react-icons/fi'
import Section from '../components/ui/Section.jsx'
import Badge from '../components/ui/Badge.jsx'
import StatReadout from '../components/ui/StatReadout.jsx'
import { FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

const REPORTS = [
  { id: 'RPT-2041', name: 'Line 3 Weekly Maintenance Summary', type: 'Maintenance', date: '2026-06-28', status: 'ready' },
  { id: 'RPT-2040', name: 'Boiler Safety Compliance Audit', type: 'Safety', date: '2026-06-26', status: 'ready' },
  { id: 'RPT-2039', name: 'Hydraulic Pump Fault Analysis', type: 'Engineering', date: '2026-06-24', status: 'processing' },
  { id: 'RPT-2038', name: 'Q2 Knowledge Base Usage Report', type: 'Analytics', date: '2026-06-20', status: 'ready' },
  { id: 'RPT-2037', name: 'Unit 7 Inspection Findings', type: 'Quality', date: '2026-06-18', status: 'ready' },
  { id: 'RPT-2036', name: 'Conveyor Belt Wear Assessment', type: 'Maintenance', date: '2026-06-15', status: 'failed' },
]

const STATUS_CONFIG = {
  ready: { tone: 'success', label: 'Ready', icon: FiCheckCircle },
  processing: { tone: 'steel', label: 'Processing', icon: FiClock },
  failed: { tone: 'danger', label: 'Failed', icon: FiAlertCircle },
}

export default function Reports() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      REPORTS.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.type.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  const readyCount = REPORTS.filter((r) => r.status === 'ready').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatReadout label="Total Reports" value={REPORTS.length} unit="docs" icon={FiFileText} />
        <StatReadout label="Ready" value={readyCount} unit="docs" delta="Available for download" deltaTone="success" icon={FiCheckCircle} />
        <StatReadout label="Generated This Month" value="42" unit="docs" delta="+11 vs last month" icon={FiClock} />
      </div>

      <Section
        eyebrow="Library"
        title="All Reports"
        action={
          <div className="flex items-center gap-2 bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 w-64">
            <FiSearch size={14} className="text-paper-500 shrink-0" />
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
                <th className="eyebrow font-normal px-2 py-3">Report</th>
                <th className="eyebrow font-normal px-2 py-3">Type</th>
                <th className="eyebrow font-normal px-2 py-3">Date</th>
                <th className="eyebrow font-normal px-2 py-3">Status</th>
                <th className="eyebrow font-normal px-2 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const cfg = STATUS_CONFIG[r.status]
                return (
                  <tr key={r.id} className="border-b border-ink-700 last:border-0 hover:bg-ink-700/40 transition-colors">
                    <td className="px-2 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-ink-700 border border-ink-600 flex items-center justify-center text-paper-500 shrink-0">
                          <FiFileText size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-paper-100 truncate">{r.name}</p>
                          <p className="readout text-[11px] text-paper-500">{r.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3.5 text-paper-500">{r.type}</td>
                    <td className="px-2 py-3.5 readout text-paper-500">{r.date}</td>
                    <td className="px-2 py-3.5">
                      <Badge tone={cfg.tone}>
                        <cfg.icon size={11} /> {cfg.label}
                      </Badge>
                    </td>
                    <td className="px-2 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          aria-label={`View ${r.name}`}
                          className="w-8 h-8 rounded-md flex items-center justify-center text-paper-500 hover:text-paper-100 hover:bg-ink-700 transition-colors"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          type="button"
                          disabled={r.status !== 'ready'}
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-paper-500 text-sm">
                    No reports match "{query}".
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
