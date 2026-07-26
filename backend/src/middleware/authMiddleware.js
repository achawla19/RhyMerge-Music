import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    if (!token) {
      return res.status(401).json({
        msg: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);

    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};

/**
 * For routes that are viewable by anyone (profiles, a user's projects) but
 * need to know WHO's asking when they're logged in — e.g. to check "is the
 * viewer a connection" for a privacy setting, or to let an owner see their
 * own private content. Never rejects: sets req.user if there's a valid
 * cookie, otherwise leaves it undefined and moves on.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);
    if (token) {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    }
  } catch {
    // Invalid/expired token on an optional route — treat as logged-out
    // rather than failing the request.
  }
  next();
};
