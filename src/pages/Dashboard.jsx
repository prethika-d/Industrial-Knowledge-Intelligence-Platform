import { useEffect, useState } from 'react'
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
import api from '../services/api'

const DEFAULT_STATS = [
  {
    label: 'Documents Uploaded',
    value: '0',
    unit: 'files',
    delta: '',
    icon: FiFileText,
  },
  {
    label: 'AI Queries',
    value: '0',
    unit: 'total',
    delta: '',
    icon: FiMessageSquare,
  },
  {
    label: 'Reports Generated',
    value: '0',
    unit: 'reports',
    delta: '',
    icon: FiBarChart2,
  },
  {
    label: 'Active Users',
    value: '0',
    unit: 'users',
    delta: '',
    icon: FiCpu,
  },
]

const DEFAULT_SYSTEMS = []

const DEFAULT_ACTIVITY = []

const ICONS = {
  'file-text': FiFileText,
  'message-square': FiMessageSquare,
  'bar-chart-2': FiBarChart2,
  cpu: FiCpu,
  'upload-cloud': FiUploadCloud,
  'check-circle': FiCheckCircle,
}

export default function Dashboard() {
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [systems, setSystems] = useState(DEFAULT_SYSTEMS)
  const [activity, setActivity] = useState(DEFAULT_ACTIVITY)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const statsRes = await api.get('/dashboard/stats/')
      const systemsRes = await api.get('/dashboard/system-status/')
      const activityRes = await api.get('/dashboard/activity-feed/')

      const mappedStats = statsRes.data.stats.map((item) => ({
        label: item.label,
        value: item.value,
        unit: item.unit,
        delta: item.delta,
        deltaTone: item.delta_tone,
        icon: ICONS[item.icon] || FiFileText,
      }))

      setStats(mappedStats)
      setSystems(systemsRes.data.systems)
      setActivity(activityRes.data.activity)
    } catch (err) {
      console.error('Dashboard API Error:', err)
    }
  }

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
            INDUSMIND AI keeps your plant&apos;s manuals, SOPs, and inspection
            reports in one searchable knowledge base — so any question about
            your equipment gets answered in seconds, not hours digging through
            binders.
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
        {stats.map((s) => (
          <StatReadout key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* System overview */}
        <Section eyebrow="Status" title="System Overview" className="lg:col-span-2">
          <div className="space-y-3">
            {systems.map((sys) => (
              <div
                key={sys.name}
                className="flex items-center justify-between py-2.5 border-b border-ink-700 last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  <FiDatabase size={15} className="text-paper-500" />
                  <span className="text-sm text-paper-100">
                    {sys.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="readout text-xs text-paper-500">
                    {sys.latency}
                  </span>
                  <Badge tone="success">{sys.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Recent activity */}
        <Section eyebrow="Log" title="Recent Activity" className="lg:col-span-3">
          <div className="space-y-1">
            {activity.map((a) => {
              const Icon = ICONS[a.icon] || FiFileText

              return (
                <div
                  key={a.id}
                  className="flex items-start gap-3 py-3 border-b border-ink-700 last:border-0"
                >
                  <div className="w-8 h-8 rounded-md bg-ink-700 border border-ink-600 flex items-center justify-center text-steel-400 shrink-0">
                    <Icon size={14} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-paper-100 leading-snug">
                      {a.text}
                    </p>

                    <p className="readout text-[11px] text-paper-500 mt-1">
                      {a.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      </div>

      {/* About */}
      <Section eyebrow="Platform" title="About INDUSMIND AI">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <FiSearch className="text-signal-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-paper-100">
                Centralized knowledge
              </p>
              <p className="text-xs text-paper-500 mt-1 leading-relaxed">
                Every manual, SOP, and inspection report lives in one indexed,
                searchable base.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <FiMessageSquare
              className="text-signal-500 shrink-0 mt-0.5"
              size={18}
            />
            <div>
              <p className="text-sm font-medium text-paper-100">
                Ask, don&apos;t search
              </p>
              <p className="text-xs text-paper-500 mt-1 leading-relaxed">
                Get direct, cited answers instead of scanning hundreds of pages
                of documentation.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <FiBarChart2
              className="text-signal-500 shrink-0 mt-0.5"
              size={18}
            />
            <div>
              <p className="text-sm font-medium text-paper-100">
                Actionable reports
              </p>
              <p className="text-xs text-paper-500 mt-1 leading-relaxed">
                Turn recurring questions and equipment data into reports your
                team can act on.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}