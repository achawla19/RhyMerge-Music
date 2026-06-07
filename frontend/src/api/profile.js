const API_URL = "http://localhost:5000/api/users";

export const getUserByUsername = async (username) => {
  const response = await fetch(`${API_URL}/${username}`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Failed to load profile");
  }

  return data;
};

export const updateMyProfile = async (payload) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Failed to update profile");
  }

  return data;
};
