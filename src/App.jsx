import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Upload from './pages/Upload.jsx'
import AIAssistant from './pages/AIAssistant.jsx'
import Analytics from './pages/Analytics.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout title="Dashboard" />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
      <Route element={<Layout title="Upload Documents" subtitle="Add manuals, SOPs & reports to the knowledge base" />}>
        <Route path="/upload" element={<Upload />} />
      </Route>
      <Route element={<Layout title="AI Assistant" subtitle="Ask questions grounded in your uploaded knowledge" />}>
        <Route path="/assistant" element={<AIAssistant />} />
      </Route>
      <Route element={<Layout title="Analytics" subtitle="Platform usage & performance metrics" />}>
        <Route path="/analytics" element={<Analytics />} />
      </Route>
      <Route element={<Layout title="Reports" subtitle="Generated intelligence reports" />}>
        <Route path="/reports" element={<Reports />} />
      </Route>
      <Route element={<Layout title="Settings" subtitle="Manage your profile & platform preferences" />}>
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
