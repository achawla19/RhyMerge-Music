const API = import.meta.env.VITE_API_URL;

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Request failed");
  return data;
};

export const getAllUsers = () =>
  fetch(`${API}/api/users/all`, { credentials: "include" }).then(handle);

export const searchUsers = ({
  q = "",
  role = "",
  genre = "",
  availability = "",
} = {}) =>
  fetch(
    `${API}/api/users/search?q=${encodeURIComponent(q)}&role=${encodeURIComponent(role)}&genre=${encodeURIComponent(genre)}&availability=${encodeURIComponent(availability)}`,
    { credentials: "include" },
  ).then(handle);

export const uploadAvatar = (file) => {
  const fd = new FormData();
  fd.append("avatar", file);
  return fetch(`${API}/api/users/avatar`, {
    method: "POST",
    credentials: "include",
    body: fd,
  }).then(handle);
};

export const unsyncConnection = (userId) =>
  fetch(`${API}/api/users/unsync/${userId}`, {
    method: "DELETE",
    credentials: "include",
  }).then(handle);
