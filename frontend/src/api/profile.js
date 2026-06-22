const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

export const getUserByUsername = async (username) => {
  const response = await fetch(`${API_URL}/${username}`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.msg || "Failed to load profile");
  return data;
};

export const updateMyProfile = async (payload) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.msg || "Failed to update profile");
  return data;
};
