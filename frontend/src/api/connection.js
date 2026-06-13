const API = "http://localhost:5000/api/connections";

export const sendConnectionRequest = async (userId) => {
  const res = await fetch(`${API}/send/${userId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to send request");
  }

  return res.json();
};

export const getRequests = async () => {
  const res = await fetch(`${API}/requests`, {
    credentials: "include",
  });

  return res.json();
};

export const getConnections = async () => {
  const res = await fetch(`${API}/connections`, {
    credentials: "include",
  });

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
  const res = await fetch(`${API}/sent`, {
    credentials: "include",
  });

  return res.json();
};
