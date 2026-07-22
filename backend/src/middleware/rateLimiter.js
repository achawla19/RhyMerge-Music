/**
 * Tiered rate limiter — three tiers based on sensitivity.
 *
 * In-memory (no Redis dep) — fine for a single instance.
 * If you scale to multiple instances behind a load balancer,
 * swap the store for ioredis + rate-limiter-flexible.
 *
 * Tiers:
 *   auth    — 10 attempts / 15 min   (brute force / credential stuffing)
 *   upload  — 20 requests / hour     (bandwidth protection)
 *   general — 200 requests / 15 min  (baseline DDoS protection)
 */

const createStore = () => {
  const map = new Map();

  // Prune stale entries every 30 min so memory stays bounded
  setInterval(
    () => {
      const now = Date.now();
      for (const [k, v] of map.entries()) {
        if (now - v.windowStart > 60 * 60 * 1000) map.delete(k);
      }
    },
    30 * 60 * 1000,
  ).unref();

  return map;
};

const createLimiter =
  (store, { windowMs, max, message }) =>
  (req, res, next) => {
    // Only enforce in production. These limits are correctly tuned against
    // real abuse (credential stuffing, scraping, DDoS) — but in local dev,
    // React StrictMode double-invokes every effect, several contexts fetch
    // on mount simultaneously, notifications poll every 60s, and a single
    // developer testing a flow repeatedly (e.g. login/logout cycles) can
    // burn through a shared 200-request/15-minute budget in a couple of
    // minutes. That's not abuse, it's just development.
    if (process.env.NODE_ENV !== "production") return next();

    const key = req.ip;
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
      store.set(key, { count: 1, windowStart: now });
      return next();
    }

    if (entry.count >= max) {
      const retryAfter = Math.ceil(
        (windowMs - (now - entry.windowStart)) / 1000,
      );
      res.set("Retry-After", String(retryAfter));
      return res
        .status(429)
        .json({ msg: message || "Too many requests. Please try again later." });
    }

    entry.count += 1;
    next();
  };

const authStore = createStore();
const uploadStore = createStore();
const generalStore = createStore();

export const authRateLimiter = (opts = {}) =>
  createLimiter(authStore, {
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Please wait 15 minutes.",
    ...opts,
  });

export const uploadRateLimiter = createLimiter(uploadStore, {
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "Upload limit reached. Please wait before uploading more files.",
});

export const generalRateLimiter = createLimiter(generalStore, {
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests. Please slow down.",
});
