/**
 * k6 load test — login flow.
 * Login is usually the single most expensive endpoint under load because
 * bcrypt is deliberately slow (that's the whole point of it) — this is
 * where a server buckles before anything else does.
 *
 * Uses the accounts created by backend/src/scripts/seed.js — run that
 * against your target database first, or point BASE_URL at an
 * environment you've already seeded.
 *
 * IMPORTANT: your rate limiter (backend/src/middleware/rateLimiter.js)
 * only enforces when NODE_ENV=production — run this against a
 * production-mode server to get numbers that mean anything. Testing
 * against local dev with rate limiting disabled will give you an overly
 * optimistic result that won't hold up once real traffic hits Render.
 *
 * Run:
 *   k6 run -e BASE_URL=https://your-backend.onrender.com k6/login.js
 */
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000";

// Matches the seed script's known accounts — all share the same password.
const SEEDED_USERNAMES = [
  "zara_k",
  "beatsbyomar",
  "lyra_writes",
  "dj_ravi",
  "the_six_string",
  "mixedby_ana",
  "kofi_beats",
  "elena_sings",
  "wordsmith_jay",
  "prod_nova",
  "guitarwolf",
  "studio_priya",
];
const SEEDED_PASSWORD = "Password123!";

export const options = {
  stages: [
    { duration: "20s", target: 10 },
    { duration: "40s", target: 10 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<1500"], // bcrypt is slow by design, wider budget
    http_req_failed: ["rate<0.02"],
  },
};

export default function () {
  const username =
    SEEDED_USERNAMES[Math.floor(Math.random() * SEEDED_USERNAMES.length)];
  const email = `${username}@example.com`;

  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email, password: SEEDED_PASSWORD }),
    { headers: { "Content-Type": "application/json" } },
  );

  check(res, {
    "login: status 200": (r) => r.status === 200,
    "login: got a token": (r) => {
      try {
        return !!JSON.parse(r.body).token;
      } catch {
        return false;
      }
    },
  });

  sleep(2); // logging in isn't something people do in a tight loop
}
