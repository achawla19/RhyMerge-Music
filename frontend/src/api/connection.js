const API = "http://localhost:5000/api/connections";

const getToken = () => localStorage.getItem("token");

export const sendConnectionRequest = async (userId) => {
  const res = await fetch(`${API}/send/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to send request");
  }

  return res.json();
};

export const getRequests = async () => {
  const res = await fetch(`${API}/requests`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};

export const getConnections = async () => {
  const res = await fetch(`${API}/connections`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};

export const acceptRequest = async (userId) => {
  const res = await fetch(`${API}/accept/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};

export const rejectRequest = async (userId) => {
  const res = await fetch(`${API}/reject/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};
