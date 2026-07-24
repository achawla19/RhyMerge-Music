/**
 * k6 load test — public browsing paths.
 * No login required: this simulates people just landing on the app and
 * looking around, which is realistically your highest-volume traffic
 * pattern before someone actually signs up.
 *
 * Run:
 *   k6 run k6/browse.js
 *   k6 run -e BASE_URL=https://your-backend.onrender.com k6/browse.js
 */
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000";

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // ramp up to 20 concurrent users
    { duration: "1m", target: 20 }, // hold at 20 for a minute
    { duration: "30s", target: 50 }, // spike to 50
    { duration: "1m", target: 50 }, // hold at 50
    { duration: "30s", target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"], // 95% of requests under 800ms
    http_req_failed: ["rate<0.02"], // less than 2% failure rate
  },
};

export default function () {
  const projects = http.get(`${BASE_URL}/api/projects`);
  check(projects, {
    "projects: status 200": (r) => r.status === 200,
    "projects: has body": (r) => r.body && r.body.length > 0,
  });

  sleep(1);

  const collab = http.get(`${BASE_URL}/api/collab`);
  check(collab, {
    "collab: status 200": (r) => r.status === 200,
  });

  sleep(1);

  const search = http.get(`${BASE_URL}/api/users/search`);
  check(search, {
    "user search: status 200": (r) => r.status === 200,
  });

  sleep(Math.random() * 2 + 1); // 1-3s "reading" pause, like a real visitor
}
