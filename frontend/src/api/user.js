const API_URL = "http://localhost:5000/api/users";

export const getAllUsers = async () => {
  const res = await fetch(API_URL, {
    credentials: "include",
  });

  return res.json();
};

export const searchUsers = async ({ q = "", role = "", genre = "" }) => {
  const query = new URLSearchParams({
    q,
    role,
    genre,
  });

  const res = await fetch(`${API_URL}/search?${query}`, {
    credentials: "include",
  });

  return res.json();
};

export const sendConnectionRequest = async (id) => {
  const res = await fetch(`${API_URL}/connect/${id}`, {
    method: "POST",
    credentials: "include",
  });

  return res.json();
};

export const acceptConnectionRequest = async (id) => {
  const res = await fetch(`${API_URL}/accept/${id}`, {
    method: "PUT",
    credentials: "include",
  });

  return res.json();
};
