import { useState } from 'react'
import { FiUser, FiBell, FiMoon, FiShield, FiInfo, FiCheck } from 'react-icons/fi'
import Section from '../components/ui/Section.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const THEME_OPTIONS = [
  { id: 'dark', label: 'Dark', swatchBg: '#14181D', swatchAccent: '#F5A524' },
  { id: 'light', label: 'Light', swatchBg: '#F7F8FA', swatchAccent: '#F5A524' },
]

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-ink-700 last:border-0">
      <div>
        <p className="text-sm text-paper-100">{label}</p>
        {description && <p className="text-xs text-paper-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${
          checked ? 'bg-signal-500' : 'bg-ink-600'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-onaccent transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function Field({ label, defaultValue, type = 'text' }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-1.5">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3.5 py-2.5 text-sm text-paper-100 outline-none focus:border-steel-500/50 transition-colors"
      />
    </label>
  )
}

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    reportReady: true,
    weeklyDigest: false,
  })
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <Section eyebrow="Account" title="Profile Information">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-steel-500 to-steel-600 flex items-center justify-center font-display font-semibold text-xl text-onaccent">
            AK
          </div>
          <div>
            <p className="text-sm font-medium text-paper-100">Arun Kumar</p>
            <p className="text-xs text-paper-500">Plant Engineer · Line 3 Facility</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name" defaultValue="Arun Kumar" />
          <Field label="Email" defaultValue="arun.kumar@indusmind.ai" type="email" />
          <Field label="Role" defaultValue="Plant Engineer" />
          <Field label="Facility" defaultValue="Line 3 — Chennai Plant" />
        </div>
        <button
          type="button"
          className="mt-5 bg-signal-500 hover:bg-signal-600 text-onaccent font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          Save changes
        </button>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section eyebrow="Alerts" title="Notifications" className="h-fit">
          <Toggle
            label="Email notifications"
            description="Receive updates about your account via email"
            checked={notifications.email}
            onChange={(v) => setNotifications((p) => ({ ...p, email: v }))}
          />
          <Toggle
            label="Report ready alerts"
            description="Get notified when a generated report is ready"
            checked={notifications.reportReady}
            onChange={(v) => setNotifications((p) => ({ ...p, reportReady: v }))}
          />
          <Toggle
            label="Weekly digest"
            description="A summary of platform activity every Monday"
            checked={notifications.weeklyDigest}
            onChange={(v) => setNotifications((p) => ({ ...p, weeklyDigest: v }))}
          />
        </Section>

        <Section eyebrow="Display" title="Theme" className="h-fit">
          <div className="grid grid-cols-2 gap-3">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                aria-pressed={theme === opt.id}
                className={`relative rounded-lg border p-4 text-left transition-colors ${
                  theme === opt.id ? 'border-signal-500 bg-signal-500/5' : 'border-ink-600 bg-ink-700'
                }`}
              >
                {theme === opt.id && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-signal-500 flex items-center justify-center text-onaccent">
                    <FiCheck size={10} />
                  </span>
                )}
                {/* Literal preview swatch — intentionally NOT theme-linked, always shows what each option looks like */}
                <div
                  className="w-full h-10 rounded-md mb-3 border border-black/10 flex items-center px-2 gap-1"
                  style={{ backgroundColor: opt.swatchBg }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.swatchAccent }} />
                  <span className="w-8 h-1.5 rounded-full" style={{ backgroundColor: `${opt.swatchAccent}40` }} />
                </div>
                <p className="text-sm font-medium text-paper-100">{opt.label}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-paper-500 mt-3">
            Applies immediately and is remembered on this device.
          </p>
        </Section>
      </div>

      <Section eyebrow="Access" title="Security">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <Field label="Current password" type="password" defaultValue="••••••••••" />
          <Field label="New password" type="password" defaultValue="" />
        </div>
        <button
          type="button"
          className="bg-ink-700 hover:bg-ink-600 border border-ink-600 text-paper-100 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          Update password
        </button>
        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-ink-700">
          <FiShield className="text-steel-400 shrink-0" size={18} />
          <p className="text-xs text-paper-500">
            Two-factor authentication is not yet enabled for this account.
          </p>
        </div>
      </Section>

      <Section eyebrow="Info" title="About Platform">
        <div className="flex items-start gap-3">
          <FiInfo className="text-paper-500 shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-paper-500 leading-relaxed">
            INDUSMIND AI — Industrial Knowledge Intelligence Platform. Version 1.0.0. Built to
            centralize industrial documentation and make it instantly queryable across your
            plant's teams.
          </p>
        </div>
      </Section>
    </div>
  )
}
