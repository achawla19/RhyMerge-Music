import { Resend } from "resend";

// Lazily constructed so a missing API key doesn't crash the server on
// boot — it just no-ops with a console warning, which matters a lot in
// local dev where nobody wants to configure Resend just to run the app.
let resendClient = null;
const getClient = () => {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
};

const FROM =
  process.env.RESEND_FROM_EMAIL || "RhyMerge <notifications@rhymerge.com>";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

/**
 * Escapes HTML-significant characters. Applied to every user-controlled
 * string before it goes into the email template below — titles,
 * descriptions, and usernames are all things a user typed, and this is
 * the last line of defense before that text becomes raw HTML in an email
 * client. Even if something upstream forgets to sanitize on save, this
 * still catches it here.
 */
const escapeHtml = (str) =>
  String(str ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );

/**
 * Wraps content in RhyMerge's coral branded email shell. Kept as
 * inline styles throughout — email clients strip <style> tags and ignore
 * most CSS selectors, so this is the one place in the codebase where
 * inline styles are the *correct* choice, not a shortcut.
 */
const renderTemplate = ({ heading, body, ctaText, ctaUrl }) => `
<div style="background:#0E0B0A;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#171211;border:1px solid rgba(249,87,111,0.25);border-radius:16px;overflow:hidden;">
    <div style="padding:28px 32px 0;">
      <span style="color:#F9576F;font-weight:700;font-size:16px;">Rhy<span style="color:#fff;">Merge</span></span>
    </div>
    <div style="padding:20px 32px 8px;">
      <h1 style="color:#F7F0EC;font-size:19px;margin:0 0 12px;line-height:1.4;">${escapeHtml(heading)}</h1>
      <p style="color:#CBB9B3;font-size:14px;line-height:1.6;margin:0 0 24px;">${escapeHtml(body)}</p>
      ${
        ctaUrl
          ? `<a href="${encodeURI(ctaUrl)}" style="display:inline-block;background:#F9576F;color:#fff;text-decoration:none;font-size:14px;font-weight:500;padding:11px 22px;border-radius:10px;">${escapeHtml(ctaText) || "View on RhyMerge"}</a>`
          : ""
      }
    </div>
    <div style="padding:20px 32px 28px;border-top:1px solid rgba(249,87,111,0.15);margin-top:20px;">
      <p style="color:#8A7A75;font-size:12px;margin:0;">
        You're getting this because email notifications are on for your account.
        <a href="${CLIENT_URL}/settings" style="color:#FF8B93;">Manage in Settings</a>.
      </p>
    </div>
  </div>
</div>`;

/** Low-level send — swallows errors so a Resend outage never breaks the
 *  action that triggered it (accepting a connection, posting, etc). */
export const sendEmail = async ({ to, subject, html }) => {
  const client = getClient();
  if (!client) {
    console.warn("sendEmail: RESEND_API_KEY not set, skipping email to", to);
    return null;
  }
  try {
    return await client.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("sendEmail failed:", err.message);
    return null;
  }
};

/** Convenience wrapper matching the shape of a Notification document —
 *  used by createNotification.js so every notification type gets an
 *  email for free without each controller needing its own template. */
export const sendNotificationEmail = ({ to, title, description, link }) =>
  sendEmail({
    to,
    subject: title,
    html: renderTemplate({
      heading: title,
      body: description,
      ctaUrl: link ? `${CLIENT_URL}${link}` : CLIENT_URL,
    }),
  });
