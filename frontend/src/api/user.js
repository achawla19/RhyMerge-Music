const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

export const getAllUsers = async () => {
  const res = await fetch(API_URL, { credentials: "include" });
  return res.json();
};

export const searchUsers = async ({ q = "", role = "", genre = "" }) => {
  const query = new URLSearchParams({ q, role, genre });
  const res = await fetch(`${API_URL}/search?${query}`, {
    credentials: "include",
  });
  return res.json();
};

// NOTE: connection request logic lives in api/connection.js
// (matches the real backend routes under /api/connections).
// Do not duplicate sendConnectionRequest/acceptConnectionRequest
// here — those endpoints don't exist under /api/users.
