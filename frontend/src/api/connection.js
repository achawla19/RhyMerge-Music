const API = `${import.meta.env.VITE_API_URL}/api/connections`;

export const sendConnectionRequest = async (userId) => {
  const res = await fetch(`${API}/send/${userId}`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  // Previously this always threw the same generic "Failed to send
  // request" regardless of why — meaning a real reason like "Already
  // connected" from the backend never reached the user. Now it does.
  if (!res.ok) throw new Error(data.message || "Failed to send request");
  return data;
};

export const getRequests = async () => {
  const res = await fetch(`${API}/requests`, { credentials: "include" });
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

export const getConnections = async () => {
  const res = await fetch(`${API}/connections`, { credentials: "include" });
  return res.json();
};

export const acceptRequest = async (userId) => {
  const res = await fetch(`${API}/accept/${userId}`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

export const rejectRequest = async (userId) => {
  const res = await fetch(`${API}/reject/${userId}`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

export const getSentRequests = async () => {
  const res = await fetch(`${API}/sent`, { credentials: "include" });
  return res.json();
};
