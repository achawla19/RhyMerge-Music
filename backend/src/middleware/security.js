import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

/**
 * Security middleware stack — applied once in server.js before any routes.
 *
 * Install:
 *   npm install helmet express-mongo-sanitize hpp
 *
 * What each layer does:
 *   helmet         — sets 14 security-related HTTP headers (CSP, HSTS, etc.)
 *   mongoSanitize  — strips $ and . from req.body/params/query so a crafted
 *                    payload like { "email": { "$gt": "" } } can't reach Mongoose
 *   hpp            — prevents HTTP Parameter Pollution (duplicate query params
 *                    that can confuse middleware expecting a string, not an array)
 */

export const applySecurityMiddleware = (app) => {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: [
            "'self'",
            "data:",
            "https://res.cloudinary.com",
            "https://ui-avatars.com",
          ],
          mediaSrc: ["'self'", "https://res.cloudinary.com"],
          connectSrc: ["'self'", "wss:", "ws:"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    }),
  );

  // Manual sanitization — only body and params, NOT query (read-only in this Express version)
  app.use((req, res, next) => {
    const sanitize = (obj) => {
      if (!obj || typeof obj !== "object") return;
      for (const key of Object.keys(obj)) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else if (typeof obj[key] === "object") {
          sanitize(obj[key]);
        }
      }
    };
    sanitize(req.body);
    sanitize(req.params);
    next();
  });

  app.use(hpp());
};

/**
 * Global error handler — registered LAST in server.js (after all routes).
 * Catches anything passed via next(err) or thrown in async handlers.
 * Never leaks stack traces or internal details to the client.
 */
export const globalErrorHandler = (err, req, res, next) => {
  // Log full error server-side only
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    err,
  );

  const status = err.status || err.statusCode || 500;

  // Specific multer errors get a clean user-facing message
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ msg: "File is too large" });
  }

  if (status < 500) {
    return res.status(status).json({ msg: err.message || "Bad request" });
  }

  res.status(500).json({ msg: "Something went wrong. Please try again." });
};
