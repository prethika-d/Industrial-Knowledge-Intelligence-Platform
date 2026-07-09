# INDUSMIND AI — Backend (Django + DRF)

Backend API for the **Industrial Knowledge Intelligence Platform** frontend
(`https://github.com/prethika-d/Industrial-Knowledge-Intelligence-Platform`).

---

## ⚠️ Important finding from the frontend audit — read this first

The frontend repo was cloned and every page/component was inspected
(`Dashboard.jsx`, `Upload.jsx`, `AIAssistant.jsx`, `Analytics.jsx`,
`Reports.jsx`, `Settings.jsx`, plus `package.json`).

**The current frontend makes zero network calls.** There is no `axios`, no
`fetch`, no `.env` / `VITE_API_URL`, and no login screen — every page holds
its data in local `useState` arrays (e.g. `Upload.jsx` "uploads" a file with
a `setTimeout` that fakes progress, `AIAssistant.jsx` picks a canned reply
from a hardcoded array). There is genuinely nothing for a backend to plug
into yet.

So "integrate without any frontend changes" is only achievable in the sense
that **this backend's response shapes exactly mirror the frontend's existing
mock data structures** (same field names, same enums, same card/array
layouts) — replacing a mock array with the matching API response is a
one-line change per page, not a redesign. But *some* minimal wiring (an
`api.js` fetch client + swapping ~6 `useState` initial values for `useEffect`
fetches) is unavoidable, because the frontend as it stands doesn't call
anything. A short integration guide for exactly that is at the bottom of
this README.

Everything below — models, endpoints, serializers — was built to match what
each page's mock data implies it will eventually receive.

---

## Tech stack

- Python 3.12+, Django 5.x, Django REST Framework
- SQLite (dev)
- SimpleJWT (JWT auth)
- drf-spectacular (OpenAPI/Swagger)
- django-filter, CORS headers, python-decouple, ReportLab (PDF generation)
- No Docker

## Project structure

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── config/                # settings, urls, wsgi, asgi
├── apps/
│   ├── accounts/          # custom User model, JWT auth, roles
│   ├── dashboard/         # stats, system status, activity feed
│   ├── documents/         # upload & document management
│   ├── assistant/         # AI query + chat history (pluggable provider)
│   ├── analytics/         # overview / usage / charts
│   ├── reports/           # report generation + PDF download
│   ├── settings_app/      # profile & preferences
│   └── common/            # pagination, permissions, exceptions, utils, seed command
├── media/                 # uploaded documents, generated report PDFs, avatars
└── static/
```

---

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env            # then edit SECRET_KEY etc. if needed

python manage.py migrate
python manage.py seed_data      # optional: realistic demo data (see below)
python manage.py createsuperuser  # optional: for /admin/

python manage.py runserver
```

API is now live at `http://127.0.0.1:8000/api/`.
Swagger UI: `http://127.0.0.1:8000/api/docs/` · Redoc: `/api/redoc/` · raw schema: `/api/schema/`.

### Seed data

`python manage.py seed_data` creates:
- 3 demo users (admin/engineer/viewer roles), password `Password123!`
- 1 superuser: `admin@indusmind.ai` / `ChangeMe123!`
- Sample documents, AI conversations, reports (with real generated PDFs), system status rows, activity log entries, and analytics metrics (overview cards, monthly growth series, department usage)

Run with `--flush` to wipe and reseed: `python manage.py seed_data --flush`

### Running tests

```bash
python manage.py test apps
```
41 tests covering auth, documents, assistant, reports, dashboard, and analytics.

---

## Authentication

All endpoints except `register` and `login` require a JWT access token:
`Authorization: Bearer <access_token>`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Create a new account |
| POST | `/api/auth/login/` | Get access/refresh tokens + user profile |
| POST | `/api/auth/token/refresh/` | Refresh an access token |
| GET/PUT | `/api/auth/profile/` | Get/update your profile |
| PUT | `/api/auth/change-password/` | Change password |

**Login example**

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"arun.kumar@indusmind.ai","password":"Password123!"}'
```
```json
{
  "refresh": "eyJ...",
  "access": "eyJ...",
  "user": {
    "id": "…", "name": "Arun Kumar", "email": "arun.kumar@indusmind.ai",
    "role": "admin", "facility": "Line 3 — Chennai Plant",
    "avatar": null, "preferences": {"theme": "dark", "notifications": {...}},
    "initials": "AK"
  }
}
```

Roles: `admin`, `engineer`, `viewer`. Engineers/Admins can write; Viewers are
read-only on documents/reports (see `apps/accounts/permissions.py`).

---

## Endpoint reference

### Dashboard
- `GET /api/dashboard/stats/` → `{ stats: [{label, value, unit, delta, delta_tone, icon}, …], documents_processed, reports_generated, active_users, ai_query_count, system_health, storage_usage_bytes }`
- `GET /api/dashboard/system-status/` → `{ systems: [{name, status, latency, uptime_percentage, health_percentage}] }`
- `GET /api/dashboard/activity-feed/?limit=10` → `{ activity: [{icon, text, time, timestamp}] }`

### Documents
- `POST /api/documents/upload/` (multipart: `file`, optional `category`)
- `GET /api/documents/?search=&category=&processing_status=&ordering=` (paginated)
- `GET /api/documents/<id>/`
- `DELETE /api/documents/<id>/` (owner or admin only)

### AI Assistant
- `POST /api/assistant/query/` `{ query, session_id? }` → `{ id, session_id, role, text, sources, model_used, timestamp }`
- `GET /api/assistant/history/?search=&ordering=` (paginated, own conversations only)
- `DELETE /api/assistant/history/<id>/`

The provider is pluggable — see `apps/assistant/services.py`. Set
`AI_PROVIDER=openai|claude|ollama` in `.env` and fill in the corresponding
stub class once you have API keys; `mock` (default) needs no keys.

### Analytics
- `GET /api/analytics/overview/` → `{ metrics: [{label, value, unit, delta, icon}] }` (4 cards)
- `GET /api/analytics/usage/` → `{ usage_by_department: [{dept, value}] }` (bar chart)
- `GET /api/analytics/charts/` → `{ growth: [{month, queries, uploads}] }` (area chart)

### Reports
- `GET /api/reports/?search=&report_type=&status=&ordering=` (paginated)
- `POST /api/reports/generate/` `{ title, report_type, summary? }` → generates a real PDF synchronously
- `GET /api/reports/<reference>/` (reference is e.g. `RPT-2041`)
- `GET /api/reports/download/<reference>/` → streams the PDF
- `DELETE /api/reports/<reference>/`

### Settings
- `GET/PUT /api/settings/profile/` `{ name, email, role, facility, avatar }`
- `PUT /api/settings/preferences/` `{ theme, notifications: {email, reportReady, weeklyDigest} }`

Full request/response schemas for every field: `/api/docs/`.

---

## Connecting the React frontend

1. **Environment**: add a `.env` in the frontend root:
   ```
   VITE_API_URL=http://127.0.0.1:8000/api
   ```
2. **CORS**: already configured to accept `http://localhost:5173` out of the box (`CORS_ALLOWED_ORIGINS` in `.env`).
3. **Minimal client** — the frontend has no HTTP client at all today, so add one, e.g. `src/lib/api.js`:
   ```js
   const BASE_URL = import.meta.env.VITE_API_URL;

   function authHeaders() {
     const token = localStorage.getItem('access_token');
     return token ? { Authorization: `Bearer ${token}` } : {};
   }

   export async function apiGet(path) {
     const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders() });
     if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
     return res.json();
   }

   export async function apiPost(path, body, isMultipart = false) {
     const res = await fetch(`${BASE_URL}${path}`, {
       method: 'POST',
       headers: isMultipart ? authHeaders() : { 'Content-Type': 'application/json', ...authHeaders() },
       body: isMultipart ? body : JSON.stringify(body),
     });
     if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
     return res.json();
   }
   ```
4. **Per-page swap** — each page currently seeds its `useState` with a mock
   array/object. Replace that initial value with `useState([])` /
   `useState(null)` and add a `useEffect` that calls the matching endpoint
   above and calls `setState(response...)`. Because every response field
   name matches the mock data's field names, the JSX below the state
   declaration needs no changes.
   - `Dashboard.jsx` → `GET /dashboard/stats/`, `/dashboard/system-status/`, `/dashboard/activity-feed/`
   - `Upload.jsx` → `POST /documents/upload/` (multipart) on drop/select, `GET /documents/` to list
   - `AIAssistant.jsx` → `POST /assistant/query/` on send, `GET /assistant/history/` on mount
   - `Analytics.jsx` → `GET /analytics/overview/`, `/analytics/usage/`, `/analytics/charts/`
   - `Reports.jsx` → `GET /reports/`, `POST /reports/generate/`, `GET /reports/download/<id>/`
   - `Settings.jsx` → `GET/PUT /settings/profile/`, `PUT /settings/preferences/`
5. **Icons**: stat/activity cards return an `icon` key (e.g. `"file-text"`,
   `"message-square"`) rather than a JSX icon component, since JSON can't
   carry components. Add a small lookup object in the frontend mapping
   these keys to the existing `react-icons/fi` imports already used on each
   page (e.g. `{'file-text': FiFileText, 'message-square': FiMessageSquare, …}`).
6. **Login**: there's currently no login page in the frontend — you'll need
   to add one (or a simple modal) that calls `POST /auth/login/` and stores
   `access`/`refresh` in `localStorage`, since every other endpoint requires
   the JWT.

---

## Sample requests

**Upload a document**
```bash
curl -X POST http://127.0.0.1:8000/api/documents/upload/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@Compressor_SOP-14.pdf" -F "category=sop"
```

**Ask the AI assistant**
```bash
curl -X POST http://127.0.0.1:8000/api/assistant/query/ \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"query": "What is the torque spec for the hydraulic pump housing?"}'
```

**Generate a report**
```bash
curl -X POST http://127.0.0.1:8000/api/reports/generate/ \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title": "Line 3 Weekly Summary", "report_type": "Maintenance"}'
```

---

## Notes

- File uploads: PDF, DOCX, DOC, TXT, XLSX up to 50MB → `media/documents/`.
- Reports are rendered as real PDFs via ReportLab → `media/reports/`.
- Pagination: `?page=&page_size=` on all list endpoints (default page size 10, max 100).
- All error responses use a consistent envelope: `{"error": {"code", "type", "message", "detail"}}`.
- Logs written to `backend/logs/app.log` (rotating, 5MB × 3 backups) and console.
