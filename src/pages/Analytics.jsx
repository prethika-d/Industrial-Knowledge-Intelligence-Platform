import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { FiTrendingUp, FiClock, FiTarget, FiUsers } from 'react-icons/fi'
import StatReadout from '../components/ui/StatReadout.jsx'
import Section from '../components/ui/Section.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const GROWTH_DATA = [
  { month: 'Jan', queries: 420, uploads: 60 },
  { month: 'Feb', queries: 680, uploads: 88 },
  { month: 'Mar', queries: 910, uploads: 102 },
  { month: 'Apr', queries: 1240, uploads: 140 },
  { month: 'May', queries: 1580, uploads: 165 },
  { month: 'Jun', queries: 2010, uploads: 198 },
]

const DEPT_USAGE = [
  { dept: 'Maintenance', value: 3420 },
  { dept: 'Operations', value: 2680 },
  { dept: 'Quality', value: 1590 },
  { dept: 'Safety', value: 1120 },
  { dept: 'Engineering', value: 980 },
]

const METRICS = [
  { label: 'Query Accuracy', value: '94.2', unit: '%', delta: '+1.8% vs last month', icon: FiTarget },
  { label: 'Avg Response Time', value: '1.4', unit: 'sec', delta: '-0.3s vs last month', icon: FiClock },
  { label: 'Monthly Active Users', value: '312', unit: 'users', delta: '+24 vs last month', icon: FiUsers },
  { label: 'Query Growth', value: '+27', unit: '%', delta: 'month over month', icon: FiTrendingUp },
]

export default function Analytics() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const gridStroke = isLight ? '#E2E5EA' : '#242A33'
  const axisStroke = isLight ? '#64748B' : '#5B6472'
  const tooltipStyle = {
    backgroundColor: isLight ? '#FFFFFF' : '#1C2128',
    border: `1px solid ${isLight ? '#E2E5EA' : '#2E353F'}`,
    borderRadius: 8,
    fontSize: 12,
    fontFamily: '"JetBrains Mono", monospace',
    color: isLight ? '#14181D' : '#EDEFF2',
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {METRICS.map((m) => (
          <StatReadout key={m.label} {...m} />
        ))}
      </div>

      <Section eyebrow="Trend" title="Platform Growth — Queries & Uploads">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GROWTH_DATA} margin={{ left: -20, right: 10 }}>
              <defs>
                <linearGradient id="queriesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5A524" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#F5A524" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="uploadsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4C9FE8" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4C9FE8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridStroke} vertical={false} />
              <XAxis dataKey="month" stroke={axisStroke} fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
              <YAxis stroke={axisStroke} fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="queries" stroke="#F5A524" fill="url(#queriesFill)" strokeWidth={2} name="AI Queries" />
              <Area type="monotone" dataKey="uploads" stroke="#4C9FE8" fill="url(#uploadsFill)" strokeWidth={2} name="Uploads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-5 mt-2">
          <span className="flex items-center gap-2 text-xs text-paper-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-signal-500" /> AI Queries
          </span>
          <span className="flex items-center gap-2 text-xs text-paper-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-steel-500" /> Uploads
          </span>
        </div>
      </Section>

      <Section eyebrow="Breakdown" title="Usage by Department">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DEPT_USAGE} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid stroke={gridStroke} horizontal={false} />
              <XAxis type="number" stroke={axisStroke} fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="dept"
                stroke={axisStroke}
                fontSize={12}
                width={100}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(76,159,232,0.05)' }} />
              <Bar dataKey="value" fill="#4C9FE8" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>
    </div>
  )
}
