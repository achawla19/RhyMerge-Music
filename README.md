<div align="center">

<img src="frontend/src/assets/logo.png" alt="RhyMerge" width="360" />

### Where musicians find each other.
A producer looking for a lyricist. A singer looking for a guitarist. A mix engineer looking for a project worth mixing.
RhyMerge is the place independent musicians post the work they're proud of, find the collaborator their project is
missing, and build a real network of people they'd actually want a text from when a new idea shows up.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Socket.io](https://img.shields.io/badge/Socket.io-realtime-black?logo=socket.io)](https://socket.io)
[![Vite](https://img.shields.io/badge/Vite-frontend-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

## Table of Contents

- [What is RhyMerge](#what-is-rhymerge)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Demo Data](#demo-data)
- [Load Testing](#load-testing)
- [Security](#security)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## What is RhyMerge

Think of it as the intersection of LinkedIn, Instagram, and Twitter — but built entirely around one idea:
**everyone here is looking for someone.** A producer for a lyricist. A singer for a guitarist. A finished beat
looking for a voice.

There's no boss, no résumé, no application process. You post what you're working on or what you need, someone
who's into it reaches out, and you either make something together or you don't. That's the whole model.

- **Signals** — a real feed for musicians: clips, thoughts, updates, not algorithmically optimized noise
- **Collab** — post what your project is missing, or answer someone else's call
- **Projects** — a portfolio that's actually listenable: stems, credits, the people who built it with you
- **Syncs** — your real network of people worth reaching out to again

## Features

<table>
<tr><td width="50%" valign="top">

**Collaboration & Discovery**
- Collab posts — "need a vocalist" style callouts, with a full respond → accept/decline flow
- Project portfolios with real audio playback (Cloudinary-hosted stems)
- Unified search across creators and projects
- Role/genre/availability-based discovery
- Community feed with likes, comments, and posts that embed a linked project or Collab card

**Real-time**
- Socket.io messaging with typing indicators, read receipts, and presence
- AES-256-GCM end-to-end message encryption
- Live in-app notifications, pushed over the same socket connection
- Cross-browser auth fallback (memory-token strategy for browsers that block third-party cookies on the WebSocket upgrade, e.g. Brave)

</td><td width="50%" valign="top">

**Identity & Networking**
- Full profiles: bio, genres, instruments, experience level, availability, social links
- Connection requests ("Syncs") with accept/reject
- An audio reel — a flat, playable stream of everything you've actually shipped across your projects

**Trust & Control**
- Granular privacy: profile visibility, email visibility, who can message you, who can see your projects
- httpOnly JWT cookies + refresh tokens, bcrypt password hashing
- Change password / delete account (soft-delete, reversible data model)
- Helmet, custom Mongo-injection sanitization, per-route rate limiting, file-type/size-restricted uploads

</td></tr>
</table>

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express + Mongoose |
| Database | MongoDB (Atlas in production) |
| Real-time | Socket.io |
| Media storage | Cloudinary (avatars, covers, stems, message attachments) |
| Auth | JWT (httpOnly cookies + refresh rotation) + bcrypt |
| Email | Resend |
| Hosting | Vercel (frontend) + Render (backend) |
| Load testing | k6 |

## Architecture

```
┌─────────────┐        HTTPS / REST        ┌─────────────┐        ┌──────────────┐
│   Vercel    │ ─────────────────────────▶ │   Render    │ ─────▶ │ MongoDB Atlas│
│  (frontend) │ ◀───────────────────────── │  (backend)  │ ◀───── │              │
└─────────────┘      WebSocket (Socket.io)  └─────────────┘        └──────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │  Cloudinary  │  (all media)
                                            └──────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │    Resend    │  (email notifications)
                                            └──────────────┘
```

Auth cookies are `httpOnly`, with `secure`/`sameSite:none` enabled in production so the split-domain
Vercel ↔ Render setup works correctly. Socket.io authenticates via the same JWT, read from the cookie
where possible and falling back to an in-memory token passed at handshake time for browsers that block
third-party cookies on WebSocket upgrades.

## Getting Started

**Prerequisites:** Node.js 18+, a MongoDB connection (local or [Atlas](https://www.mongodb.com/atlas)),
a [Cloudinary](https://cloudinary.com) account.

```bash
git clone https://github.com/achawla19/RhyMerge-Music/
cd RhyMerge-Self
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env    # fill in your own values — see below
npm start
```

**Frontend** (in a second terminal):
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`, the backend at `http://localhost:5000`.

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for the full, documented list. At minimum, the
backend needs:

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Two **different** random secrets — see `.env.example` for how to generate |
| `MESSAGE_ENCRYPTION_KEY` | 32-byte hex key for AES-256-GCM message encryption. **Back this up** — losing it makes every existing message permanently undecryptable |
| `CLOUDINARY_URL` | From your Cloudinary dashboard |
| `CLIENT_URL` | Your deployed frontend URL — used for CORS and email links |
| `RESEND_API_KEY` | Optional — email notifications degrade gracefully without it |

## Project Structure

```
backend/
  src/
    controllers/     # request handlers
    models/           # Mongoose schemas
    routes/           # Express routers
    middleware/       # auth, rate limiting, security, uploads
    socket/           # Socket.io connection + event handlers
    utils/            # encryption, email, sanitization, notifications
    scripts/          # seed.js — local demo data generator
frontend/
  src/
    pages/            # route-level views
    components/       # shared/reusable UI, grouped by feature
    context/           # Auth, Socket, Notifications, Messages, ProjectPanel
    api/               # one file per REST resource
    layouts/           # app shell (Sidebar, TopBar, PlayerBar)
k6/                    # load test scripts + README
```

## Demo Data

`backend/src/scripts/seed.js` populates a **local/dev** database with realistic musicians, projects,
Collab posts, connections, and messages — useful for development and testing.

```bash
node backend/src/scripts/seed.js            # adds demo data, never touches existing accounts
node backend/src/scripts/seed.js --force    # wipes ALL data first — local/dev only, never production
```

All seeded accounts share the password `Password123!`. **This script is for local development only** —
it's intentionally never run against the production database, since fake profiles that can't actually
respond to a real user's message or Collab reach-out would undermine the entire point of the product.

## Load Testing

Three [k6](https://k6.io) scripts in `/k6`, covering public browsing, the login flow specifically
(bcrypt is usually where a server buckles first), and a full authenticated session. See `k6/README.md`
for setup and how to read the results.

## Security

- Helmet with a real Content-Security-Policy (not default-permissive)
- Custom recursive Mongo-operator sanitization on all request bodies/params
- Per-route rate limiting (tighter on auth endpoints), disabled automatically outside `NODE_ENV=production`
  so it doesn't get in the way of local development
- All user-generated text (bios, project titles, post content) is HTML-stripped on write and re-escaped
  again before ever reaching an email template — defense in depth against stored XSS
- Ownership/authorization checks on every mutating endpoint (can't edit/delete something you don't own)
- Soft-delete throughout (users, projects) rather than destructive deletes

## Deployment

- **Frontend → Vercel**: `frontend/vercel.json` includes the SPA rewrite rule required for client-side
  routing (without it, refreshing on a deep link like `/collab/:id` 404s)
- **Backend → Render**: `backend/render.yaml` provides a ready-to-import Blueprint
- **Database → MongoDB Atlas**

Both Vercel and Render auto-deploy on push to your connected branch once set up.

## Roadmap

- Comment editing/deletion on Community posts
- Push notifications (web push), beyond the current in-app real-time layer
- CI pipeline (lint + build check on PRs)

## License

Private project — all rights reserved.

---

<div align="center">

**RhyMerge** — where rhythms collide.

</div>
