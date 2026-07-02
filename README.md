# INDUSMIND AI — Frontend

Industrial Knowledge Intelligence Platform. React + Vite + Tailwind CSS + React Router + React Icons + Recharts.

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL (default http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    layout/       Sidebar, Navbar, Layout (shared shell)
    ui/            StatReadout, Badge, Section (reusable primitives)
  pages/
    Dashboard.jsx
    Upload.jsx
    AIAssistant.jsx
    Analytics.jsx
    Reports.jsx
    Settings.jsx
  App.jsx          Route definitions
  index.css        Design tokens / global styles
```

## Design system

- **Colors**: graphite base (`ink-*`), industrial safety amber (`signal-*`) as the primary
  accent, steel blue (`steel-*`) reserved for AI-specific elements and charts.
- **Type**: Space Grotesk (headings), Inter (body), JetBrains Mono (all data/stat readouts).
- **Signature motif**: `.bracket-frame` utility class — corner brackets on hero panels and
  stat cards, echoing engineering-drawing annotations. `.readout` for monospace data.
- All tokens live in `tailwind.config.js` and `src/index.css` — change them once, every page
  updates.

## Wiring up the backend

Every page currently uses local mock data so the UI can be reviewed and demoed standalone.
Replace these with real API calls:

| Page | File | Needs |
|---|---|---|
| Dashboard | `src/pages/Dashboard.jsx` | stats + system status + activity feed endpoints |
| Upload | `src/pages/Upload.jsx` | file storage / upload + document processing API |
| AI Assistant | `src/pages/AIAssistant.jsx` | AI query API, replace the `setTimeout` mock in `send()` |
| Analytics | `src/pages/Analytics.jsx` | analytics/usage data API |
| Reports | `src/pages/Reports.jsx` | report listing + generation + download API |
| Settings | `src/pages/Settings.jsx` | user profile + auth + preferences API |

Swap the hard-coded arrays (`STATS`, `REPORTS`, `SYSTEMS`, etc.) for data fetched with your
preferred client (fetch/axios/react-query) and the UI will render exactly the same.
