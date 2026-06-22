import crypto from "crypto";

/**
 * AES-256-GCM encryption for message content at rest.
 *
 * IMPORTANT — what this protects against vs what it doesn't:
 * This encrypts message content before it's written to MongoDB, using a
 * key the SERVER holds (MESSAGE_ENCRYPTION_KEY). It protects your data if
 * the database is ever leaked, dumped, or accessed directly — messages
 * are unreadable ciphertext without the key.
 *
 * This is NOT end-to-end encryption. The server itself can still decrypt
 * every message (it has to, in order to send it to the right people and
 * show it back to you on refresh). True E2EE would mean only the sender
 * and recipient's devices hold the keys, and the server only ever sees
 * ciphertext — that requires per-user key pairs and a client-side crypto
 * layer, which is a much bigger architectural change. This is the
 * realistic, honest level of protection for this app's design today.
 *
 * Setup: add a 32-byte hex key to your .env as MESSAGE_ENCRYPTION_KEY.
 * Generate one with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // recommended for GCM

const getKey = () => {
  const key = process.env.MESSAGE_ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error(
      "MESSAGE_ENCRYPTION_KEY is missing or invalid — it must be a 64-character hex string (32 bytes). " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  return Buffer.from(key, "hex");
};

/**
 * Encrypts plain text. Returns a single string in the format
 * "iv:authTag:ciphertext" (all hex) so it fits in one Mongoose String field.
 */
export const encrypt = (plainText) => {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(String(plainText), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext.toString("hex")}`;
};

/**
 * Decrypts a string previously produced by encrypt(). Returns null
 * (instead of throwing) if the payload is malformed or tampering is
 * detected, so a single corrupted row can't crash a whole conversation
 * fetch — the caller can show a placeholder for that one message instead.
 */
export const decrypt = (payload) => {
  try {
    const key = getKey();
    const [ivHex, authTagHex, ciphertextHex] = String(payload).split(":");
    if (!ivHex || !authTagHex || !ciphertextHex) return null;

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(ivHex, "hex"),
    );
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    const plainText = Buffer.concat([
      decipher.update(Buffer.from(ciphertextHex, "hex")),
      decipher.final(),
    ]);

    return plainText.toString("utf8");
  } catch (err) {
    console.error("Message decryption failed:", err.message);
    return null;
  }
};
