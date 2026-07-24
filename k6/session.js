/**
 * k6 load test — a realistic logged-in session.
 * Unlike browse.js and login.js (which test one endpoint each), this
 * simulates an actual user: log in, keep the session cookie, then act
 * like someone who just opened the app — check notifications, browse
 * Collab, look at their own profile. Cookie-based auth adds real
 * overhead (cookie jar, credentials on every request) that isolated
 * endpoint tests don't capture.
 *
 * Uses the same seeded accounts as login.js.
 *
 * Run:
 *   k6 run -e BASE_URL=https://your-backend.onrender.com k6/session.js
 */
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000";

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
    { duration: "30s", target: 15 },
    { duration: "1m", target: 15 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.02"],
  },
};

export default function () {
  const jar = http.cookieJar();
  const username =
    SEEDED_USERNAMES[Math.floor(Math.random() * SEEDED_USERNAMES.length)];
  const email = `${username}@example.com`;

  // 1. Log in — cookie jar automatically picks up the Set-Cookie response
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email, password: SEEDED_PASSWORD }),
    { headers: { "Content-Type": "application/json" } },
  );
  const loggedIn = check(loginRes, {
    "login succeeded": (r) => r.status === 200,
  });
  if (!loggedIn) return;

  sleep(1);

  // 2. Check notifications — every session does this almost immediately
  const notifs = http.get(`${BASE_URL}/api/notifications?page=1`, { jar });
  check(notifs, { "notifications: status 200": (r) => r.status === 200 });

  sleep(1.5);

  // 3. Browse Collab
  const collab = http.get(`${BASE_URL}/api/collab`, { jar });
  check(collab, { "collab: status 200": (r) => r.status === 200 });

  sleep(2);

  // 4. Check own profile
  const me = http.get(`${BASE_URL}/api/auth/me`, { jar });
  check(me, { "me: status 200": (r) => r.status === 200 });

  sleep(1);

  // 5. Log out
  const logout = http.post(`${BASE_URL}/api/auth/logout`, null, { jar });
  check(logout, { "logout: status 200": (r) => r.status === 200 });

  sleep(1);
}
