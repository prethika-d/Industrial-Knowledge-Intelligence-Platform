import {
  FiFileText,
  FiMessageSquare,
  FiBarChart2,
  FiCpu,
  FiDatabase,
  FiSearch,
  FiCheckCircle,
  FiUploadCloud,
  FiArrowRight,
} from 'react-icons/fi'
import StatReadout from '../components/ui/StatReadout.jsx'
import Section from '../components/ui/Section.jsx'
import Badge from '../components/ui/Badge.jsx'
import { Link } from 'react-router-dom'

const STATS = [
  { label: 'Documents Uploaded', value: '1,284', unit: 'files', delta: '+42 this week', icon: FiFileText },
  { label: 'AI Queries', value: '9,610', unit: 'total', delta: '+318 this week', icon: FiMessageSquare },
  { label: 'Reports Generated', value: '206', unit: 'reports', delta: '+11 this week', icon: FiBarChart2 },
  { label: 'Machines Connected', value: '37', unit: 'units', delta: '3 pending sync', deltaTone: 'neutral', icon: FiCpu },
]

const SYSTEMS = [
  { name: 'AI Engine', status: 'Operational', latency: '142ms' },
  { name: 'Knowledge Base', status: 'Operational', latency: '58ms' },
  { name: 'Database', status: 'Operational', latency: '21ms' },
  { name: 'Document Index', status: 'Operational', latency: '89ms' },
]

const ACTIVITY = [
  { icon: FiUploadCloud, text: 'Compressor SOP-14.pdf uploaded to Line 3 knowledge base', time: '6 min ago' },
  { icon: FiMessageSquare, text: 'Query resolved: "Torque spec for hydraulic pump housing?"', time: '24 min ago' },
  { icon: FiCheckCircle, text: 'Weekly maintenance report generated for Unit 7', time: '1 hr ago' },
  { icon: FiUploadCloud, text: 'Boiler Safety Manual Rev.3 indexed successfully', time: '3 hr ago' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="bracket-frame relative overflow-hidden rounded-2xl border border-ink-600 bg-blueprint bg-blueprint bg-ink-800 p-8 lg:p-10">
        <div className="relative max-w-2xl">
          <Badge tone="signal">Live · Knowledge Base Active</Badge>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-paper-100 mt-4 leading-tight">
            Welcome back, Arun.
          </h1>
          <p className="text-paper-500 mt-3 leading-relaxed">
            INDUSMIND AI keeps your plant's manuals, SOPs, and inspection reports in one searchable
            knowledge base — so any question about your equipment gets answered in seconds, not
            hours digging through binders.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 bg-signal-500 hover:bg-signal-600 text-onaccent font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              Ask the AI Assistant <FiArrowRight size={15} />
            </Link>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-ink-700 hover:bg-ink-600 border border-ink-600 text-paper-100 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              Upload a document
            </Link>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map((s) => (
          <StatReadout key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* System overview */}
        <Section eyebrow="Status" title="System Overview" className="lg:col-span-2">
          <div className="space-y-3">
            {SYSTEMS.map((sys) => (
              <div
                key={sys.name}
                className="flex items-center justify-between py-2.5 border-b border-ink-700 last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  <FiDatabase size={15} className="text-paper-500" />
                  <span className="text-sm text-paper-100">{sys.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="readout text-xs text-paper-500">{sys.latency}</span>
                  <Badge tone="success">{sys.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Recent activity */}
        <Section eyebrow="Log" title="Recent Activity" className="lg:col-span-3">
          <div className="space-y-1">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-ink-700 last:border-0">
                <div className="w-8 h-8 rounded-md bg-ink-700 border border-ink-600 flex items-center justify-center text-steel-400 shrink-0">
                  <a.icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-paper-100 leading-snug">{a.text}</p>
                  <p className="readout text-[11px] text-paper-500 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* About */}
      <Section eyebrow="Platform" title="About INDUSMIND AI">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <FiSearch className="text-signal-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-paper-100">Centralized knowledge</p>
              <p className="text-xs text-paper-500 mt-1 leading-relaxed">
                Every manual, SOP, and inspection report lives in one indexed, searchable base.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <FiMessageSquare className="text-signal-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-paper-100">Ask, don't search</p>
              <p className="text-xs text-paper-500 mt-1 leading-relaxed">
                Get direct, cited answers instead of scanning hundreds of pages of documentation.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <FiBarChart2 className="text-signal-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-paper-100">Actionable reports</p>
              <p className="text-xs text-paper-500 mt-1 leading-relaxed">
                Turn recurring questions and equipment data into reports your team can act on.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
