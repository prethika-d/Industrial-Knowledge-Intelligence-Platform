import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  FiShield,
  FiInfo,
  FiCheck,
} from 'react-icons/fi'
import Section from '../components/ui/Section.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const API = 'http://127.0.0.1:8000'

const THEME_OPTIONS = [
  { id: 'dark', label: 'Dark', swatchBg: '#14181D', swatchAccent: '#F5A524' },
  { id: 'light', label: 'Light', swatchBg: '#F7F8FA', swatchAccent: '#F5A524' },
]

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-ink-700 last:border-0">
      <div>
        <p className="text-sm text-paper-100">{label}</p>
        {description && (
          <p className="text-xs text-paper-500 mt-0.5">{description}</p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors ${
          checked ? 'bg-signal-500' : 'bg-ink-600'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}) {
  return (
    <label className="block">
      <span className="eyebrow block mb-1.5">{label}</span>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3.5 py-2.5 text-sm text-paper-100 outline-none focus:border-steel-500/50 transition-colors"
      />
    </label>
  )
}

export default function Settings() {
  const { theme, setTheme } = useTheme()

  const token = localStorage.getItem('access')

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    facility: '',
  })

  const [notifications, setNotifications] = useState({
    email: true,
    reportReady: true,
    weeklyDigest: false,
  })

  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${API}/api/auth/profile/`,
        { headers }
      )

      setProfile({
        name: res.data.name || '',
        email: res.data.email || '',
        role: res.data.role || '',
        facility: res.data.facility || '',
      })

      if (res.data.preferences?.notifications) {
        setNotifications(
          res.data.preferences.notifications
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  const saveProfile = async () => {
    try {
      await axios.put(
        `${API}/api/auth/profile/`,
        profile,
        { headers }
      )

      alert('Profile updated successfully')
    } catch (err) {
      console.log(err)
      alert('Failed to update profile')
    }
  }

  const savePreferences = async (
    newNotifications
  ) => {
    try {
      setNotifications(newNotifications)

      await axios.post(
        `${API}/api/settings/preferences/`,
        {
          notifications: newNotifications,
        },
        { headers }
      )
    } catch (err) {
      console.log(err)
    }
  }

  const changePassword = async () => {
    try {
      await axios.put(
        `${API}/api/auth/change-password/`,
        passwords,
        { headers }
      )

      alert('Password changed successfully')

      setPasswords({
        current_password: '',
        new_password: '',
      })
    } catch (err) {
      console.log(err)
      alert('Failed to change password')
    }
  }

  return (
    <div className="space-y-6">
      <Section
        eyebrow="Account"
        title="Profile Information"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-steel-500 to-steel-600 flex items-center justify-center font-display font-semibold text-xl text-white">
            {profile.name
              ? profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
              : 'U'}
          </div>

          <div>
            <p className="text-sm font-medium text-paper-100">
              {profile.name}
            </p>
            <p className="text-xs text-paper-500">
              {profile.role}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Full name"
            value={profile.name}
            onChange={(e) =>
              setProfile({
                ...profile,
                name: e.target.value,
              })
            }
          />

          <Field
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({
                ...profile,
                email: e.target.value,
              })
            }
          />

          <Field
            label="Role"
            value={profile.role}
            onChange={(e) =>
              setProfile({
                ...profile,
                role: e.target.value,
              })
            }
          />

          <Field
            label="Facility"
            value={profile.facility}
            onChange={(e) =>
              setProfile({
                ...profile,
                facility: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={saveProfile}
          className="mt-5 bg-signal-500 hover:bg-signal-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg"
        >
          Save Changes
        </button>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section
          eyebrow="Alerts"
          title="Notifications"
        >
          <Toggle
            label="Email notifications"
            description="Receive updates via email"
            checked={notifications.email}
            onChange={(v) =>
              savePreferences({
                ...notifications,
                email: v,
              })
            }
          />

          <Toggle
            label="Report ready alerts"
            description="Notify when reports are generated"
            checked={notifications.reportReady}
            onChange={(v) =>
              savePreferences({
                ...notifications,
                reportReady: v,
              })
            }
          />

          <Toggle
            label="Weekly digest"
            description="Weekly platform summary"
            checked={notifications.weeklyDigest}
            onChange={(v) =>
              savePreferences({
                ...notifications,
                weeklyDigest: v,
              })
            }
          />
        </Section>

        <Section
          eyebrow="Display"
          title="Theme"
        >
          <div className="grid grid-cols-2 gap-3">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  setTheme(opt.id)
                }
                className={`relative rounded-lg border p-4 text-left ${
                  theme === opt.id
                    ? 'border-signal-500 bg-signal-500/5'
                    : 'border-ink-600 bg-ink-700'
                }`}
              >
                {theme === opt.id && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-signal-500 flex items-center justify-center text-white">
                    <FiCheck size={10} />
                  </span>
                )}

                <div
                  className="w-full h-10 rounded-md mb-3 border border-black/10"
                  style={{
                    backgroundColor:
                      opt.swatchBg,
                  }}
                />

                <p className="text-sm font-medium text-paper-100">
                  {opt.label}
                </p>
              </button>
            ))}
          </div>
        </Section>
      </div>

      <Section
        eyebrow="Access"
        title="Security"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <Field
            label="Current Password"
            type="password"
            value={
              passwords.current_password
            }
            onChange={(e) =>
              setPasswords({
                ...passwords,
                current_password:
                  e.target.value,
              })
            }
          />

          <Field
            label="New Password"
            type="password"
            value={passwords.new_password}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                new_password:
                  e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={changePassword}
          className="bg-ink-700 hover:bg-ink-600 border border-ink-600 text-paper-100 font-medium text-sm px-4 py-2.5 rounded-lg"
        >
          Update Password
        </button>

        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-ink-700">
          <FiShield
            className="text-steel-400"
            size={18}
          />
          <p className="text-xs text-paper-500">
            Two-factor authentication is
            not enabled.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Info"
        title="About Platform"
      >
        <div className="flex items-start gap-3">
          <FiInfo
            className="text-paper-500 mt-0.5"
            size={16}
          />
          <p className="text-xs text-paper-500">
            INDUSMIND AI — Industrial
            Knowledge Intelligence
            Platform v1.0.0
          </p>
        </div>
      </Section>
    </div>
  )
}