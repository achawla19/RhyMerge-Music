/**
 * Minimal in-memory rate limiter — no extra dependency required.
 *
 * Protects auth endpoints (login/register) from brute-force and
 * credential-stuffing attacks by capping how many attempts a single IP
 * can make in a rolling time window.
 *
 * Note: this is in-memory, so it resets on server restart and isn't
 * shared across multiple server instances. That's fine for a single-
 * instance deployment. If you ever scale to multiple backend instances
 * behind a load balancer, swap this for a Redis-backed limiter
 * (e.g. rate-limiter-flexible or express-rate-limit + a Redis store)
 * so all instances share the same counters.
 */

const attempts = new Map(); // key -> { count, windowStart }

export const authRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 20,
} = {}) => {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const entry = attempts.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
      attempts.set(key, { count: 1, windowStart: now });
      return next();
    }

    if (entry.count >= max) {
      const retryAfterSec = Math.ceil(
        (windowMs - (now - entry.windowStart)) / 1000,
      );
      res.set("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        msg: "Too many attempts. Please try again later.",
      });
    }

    entry.count += 1;
    next();
  };
};

// Periodic cleanup so the Map doesn't grow unbounded over a long-running process
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of attempts.entries()) {
      if (now - entry.windowStart > 60 * 60 * 1000) attempts.delete(key);
    }
  },
  60 * 60 * 1000,
).unref();
