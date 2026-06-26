/**
 * Escape special regex characters from user-supplied search strings.
 * Without this, a search for "a.b" matches "axb", "a+b" throws an error, etc.
 */
export const escapeRegex = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Strip HTML tags and trim. Used before persisting user-supplied content
 * that will be rendered (post bodies, bios, etc.)
 */
export const stripHtml = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim();
};

/**
 * Returns true if str is a safe alphanumeric-ish string (no Mongo operators).
 * Used as a secondary guard on field values before they reach a query.
 */
export const isSafeString = (str) => {
  if (typeof str !== "string") return false;
  // Block $ (Mongo operators), backticks, and null bytes
  return !/[\$`\u0000]/.test(str);
};
