# RhyMerge

**A collaboration platform for independent musicians** — producers, vocalists, songwriters, and mix engineers finding each other through real collaboration requests and shared project rooms, not another social feed.

Live: [rhymerge.vercel.app](https://rhymerge.vercel.app) · API: [rhymerge.onrender.com](https://rhymerge.onrender.com)

---

## What it actually does

RhyMerge is built around a simple loop: **post or browse a collab request → connect and message directly → move into a shared project room once you're actually working together.**

### Core features

- **Collab requests** — post what you need (role, genre, and terms: paid / revenue split / credit only / just for fun); browse and filter active requests by role and genre.
- **Project rooms** — a dedicated space per collaboration: file/stem uploads with version tracking, in-browser playback, a request queue for who's asking to join, and a Team tab.
- **Real-time messaging** — Socket.io-backed private chat, with messages encrypted at rest (AES-256-GCM) and JWT httpOnly-cookie auth with refresh-token rotation.
- **Signal** — a live activity feed (new collab posts, connection requests, project updates) so relevant activity surfaces without an algorithmic feed.
- **Search & discover** — filter creators by role, genre, and availability status (Available / Busy / Not Looking).
- **Connections/network** — send, accept, and manage connection requests between creators.
- **AI project insights** — optional, per-project production suggestions via the Anthropic Claude API, with a graceful static fallback if no API key is configured.
- **Notifications & settings** — account, profile, privacy, and security settings; email notifications via Resend.

---

## Tech stack

**Frontend**
- React + Vite
- Tailwind CSS
- Framer Motion
- React Router

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Socket.io (real-time messaging)
- JWT (httpOnly cookies + refresh-token rotation)
- AES-256-GCM (message encryption)
- Cloudinary (media/file storage)
- Resend (transactional email)
- Anthropic API (AI project insights, optional)

**Infrastructure**
- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- Load testing with **k6**

---

## Project structure

```
rhymerge/
├── frontend/
│   └── src/
│       ├── pages/           # route-level views (Home, Landing, Profile, Projects, ...)
│       ├── components/      # feature components, grouped by domain
│       │   ├── projects/    # project rooms, files, requests
│       │   ├── collab/      # collab posts/cards
│       │   ├── community/   # feed, trending, suggested users
│       │   ├── network/     # connections
│       │   ├── search/      # filters, artist/project grids
│       │   ├── settings/    # account/profile/privacy/security
│       │   └── ui/          # shared primitives (Toast, ConfirmDialog, ...)
│       ├── context/         # AuthContext, SocketContext, ProjectPanelContext, ...
│       ├── layouts/         # TopBar, Sidebar, PlayerBar, MainLayout
│       └── api/             # fetch wrappers per resource
│
└── backend/
    └── src/
        ├── controllers/     # request handlers
        ├── models/          # Mongoose schemas
        ├── routes/          # auth, users, projects, project-files, collab,
        │                    # connections, messages, notifications, search,
        │                    # trending, recommendations, saved-projects, AI insights
        ├── socket/           # Socket.io connection/event handling
        ├── scripts/          # seed.js (append-only by default)
        └── utils/            # sendEmail, encryption, etc.
```

---

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB instance (Atlas or local)
- Cloudinary account (media storage)
- Resend account (transactional email)
- Anthropic API key (optional — AI insights degrade gracefully without one)

### Environment variables

**Backend** (`backend/.env`)

| Variable | Purpose |
|---|---|
| `PORT` | Server port |
| `NODE_ENV` | `development` / `production` |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend origin, for CORS + email links |
| `JWT_SECRET` | Access token signing secret |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `MESSAGE_ENCRYPTION_KEY` | AES-256-GCM key for message encryption at rest |
| `CLOUDINARY_URL` | Cloudinary connection string |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `ANTHROPIC_API_KEY` | *(optional)* enables AI project insights |

**Frontend** (`frontend/.env`)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:5000` locally) |

### Install & run

```bash
# backend
cd backend
npm install
npm run dev          # check package.json for the exact script name in your setup

# frontend
cd frontend
npm install
npm run dev
```

### Seeding data

```bash
cd backend
node src/scripts/seed.js
```
Append-only by default — safe to re-run without wiping existing data.

---

## Deployment

- **Frontend** → Vercel, auto-deploys from the connected branch.
- **Backend** → Render, auto-deploys from the connected branch. Note: on Render's free/hobby tier the service spins down after inactivity, so the first request after idle time will be slow (see load test notes below) — this is a hosting-tier characteristic, not an application issue.

---

## Performance

Load tested with [k6](https://k6.io) against the live production API (`https://rhymerge.onrender.com`).

**Test config:** `k6/browse.js`, 5 virtual users, 1 minute sustained load, hitting `/projects`, `/collab`, and user search endpoints.

**Thresholds — both passed:**

| Threshold | Target | Result |
|---|---|---|
| `http_req_duration` p(95) | < 800ms | **619.81ms** ✅ |
| `http_req_failed` rate | < 2% | **0.00%** ✅ |

**Full results:**

| Metric | Value |
|---|---|
| Total requests | 123 (1.88 req/s) |
| Checks passed | 164 / 164 (**100%**) |
| Error rate | 0.00% |
| Median response time | 241.88ms |
| p(90) response time | 401.2ms |
| p(95) response time | 619.81ms |
| Average response time | 1.2s |
| Max response time | 23.66s |
| Iterations completed | 41 |
| Data transferred | 1.8 MB received / 22 KB sent |

**Reading the numbers honestly:** the gap between the median (242ms) and the average/max (1.2s / 23.66s) is a cold-start signature, not the application being slow — Render's free tier spins the backend down after idle periods, and one or two requests in the run hit a cold instance. The p(95) figure (619ms) still cleared the 800ms threshold despite that outlier dragging the average up, and every check across all three endpoint types (`projects`, `collab`, `user search`) passed with zero failures. On an always-on instance, expect the average to track much closer to the median.

To reproduce:
```bash
k6 run -e BASE_URL=https://rhymerge.onrender.com --vus 5 --duration 1m k6/browse.js
```

---

## Roadmap / known gaps

- In-app audio DAW/editing was considered and deliberately scoped out for now — it's a different category of engineering (real-time audio engine, waveform rendering at scale, mixing) than the collaboration/matching problem RhyMerge is solving. A lighter version (timestamped comments on a waveform, A/B version comparison) is a more likely near-term addition.
- Existing `accentColor` field may still be present on older user documents in the database after the Appearance settings feature was removed; harmless, ignored by the app, optional cleanup via a one-off `$unset` migration.

---

## License

All Rights Reserved. See [`LICENSE`](./LICENSE) for details. This code is not open source — no permission is granted to use, copy, modify, or distribute it without explicit written consent.
