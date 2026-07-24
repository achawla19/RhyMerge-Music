# Load testing with k6

Three scripts, each testing a different real usage pattern:

| Script       | Tests                                                                       | Needs auth?              |
| ------------ | --------------------------------------------------------------------------- | ------------------------ |
| `browse.js`  | Public browsing — projects, collab, search                                  | No                       |
| `login.js`   | The login endpoint specifically (bcrypt is the usual bottleneck)            | No (it _performs_ login) |
| `session.js` | A full realistic session: login → notifications → collab → profile → logout | Yes (handles it itself)  |

## Setup

**1. Install k6** (one-time, not an npm package):

- Mac: `brew install k6`
- Windows: `choco install k6` or download from https://k6.io/docs/get-started/installation/
- Linux: see https://k6.io/docs/get-started/installation/

**2. Seed the target database** so `login.js`/`session.js` have real accounts to log into:

```
node backend/src/scripts/seed.js
```

(or `--force` if it already has data you're OK wiping — see the script's own comments)

**3. Run against a production-mode server**, not local dev. Your rate limiter only enforces when `NODE_ENV=production` — testing against dev gives you numbers that won't hold up once real traffic hits Render.

## Running

```bash
k6 run k6/browse.js
k6 run -e BASE_URL=https://your-backend.onrender.com k6/browse.js
k6 run -e BASE_URL=https://your-backend.onrender.com k6/login.js
k6 run -e BASE_URL=https://your-backend.onrender.com k6/session.js
```

## Reading the output

k6 prints a summary at the end. The two numbers that matter most:

- **`http_req_failed`** — should stay near 0%. Anything above ~2% means the server is dropping requests under that load.
- **`http_req_duration` (p95)** — the 95th-percentile response time. If this climbs sharply as virtual users ramp up (rather than staying roughly flat), that's your server hitting its ceiling.

If you're on Render's free tier: expect it to fall over well before Vercel does. Free-tier Render spins down on inactivity and has limited CPU — these scripts will tell you exactly where that ceiling is, which is the point.
