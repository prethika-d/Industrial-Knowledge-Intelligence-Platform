import { NavLink } from 'react-router-dom'
import {
  FiGrid,
  FiUploadCloud,
  FiMessageSquare,
  FiBarChart2,
  FiFileText,
  FiSettings,
  FiActivity,
} from 'react-icons/fi'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/upload', label: 'Upload', icon: FiUploadCloud },
  { to: '/assistant', label: 'AI Assistant', icon: FiMessageSquare },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/reports', label: 'Reports', icon: FiFileText },
  { to: '/settings', label: 'Settings', icon: FiSettings },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 h-screen sticky top-0 bg-ink-800 border-r border-ink-600">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 h-20 border-b border-ink-600">
        <div className="relative w-9 h-9 rounded-md bg-signal-500/10 border border-signal-500/30 flex items-center justify-center">
          <FiActivity className="text-signal-500" size={18} />
        </div>
        <div className="leading-tight">
          <p className="font-display font-semibold text-[15px] text-paper-100">INDUSMIND</p>
          <p className="eyebrow -mt-0.5">AI Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="eyebrow px-3 mb-2">Navigate</p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-signal-500/10 text-signal-400 border border-signal-500/25'
                  : 'text-paper-500 border border-transparent hover:bg-ink-700 hover:text-paper-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={isActive ? 'text-signal-500' : 'text-paper-500 group-hover:text-paper-100'}
                />
                <span>{label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-signal-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System status footer */}
      <div className="p-4 border-t border-ink-600">
        <div className="panel px-3 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="eyebrow">System</span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              ONLINE
            </span>
          </div>
          <p className="text-xs text-paper-500">All engines operating normally</p>
        </div>
      </div>
    </aside>
  )
}
