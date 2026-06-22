/**
 * Escapes regex special characters so user-supplied search text can never
 * be interpreted as a regex pattern by MongoDB's $regex operator.
 *
 * Without this, a search query like `(a+)+$` (or any other catastrophic
 * backtracking pattern) sent straight into $regex can hang the database
 * processing a single query — a classic ReDoS (Regular Expression Denial
 * of Service) attack. Escaping turns it into a literal, safe substring
 * search instead.
 */
export const escapeRegex = (str) => {
  if (typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Confirms a value is a non-empty string before it's ever used inside a
 * Mongoose query filter (e.g. User.findOne({ email })).
 *
 * Express's JSON body parser will happily turn a request body like
 * { "email": { "$ne": null } } into a real JS object — and Mongo will
 * treat that object as a query operator, not a value to match. This
 * blocks that entire class of NoSQL injection at the door.
 */
export const isSafeString = (value) =>
  typeof value === "string" && value.trim().length > 0;
