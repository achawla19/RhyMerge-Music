const API = import.meta.env.VITE_API_URL;

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Request failed");
  return data;
};

export const getProjects = (page = 1, limit = 20) =>
  fetch(`${API}/api/projects?page=${page}&limit=${limit}`, {
    credentials: "include",
  }).then(handle);

export const getProjectById = (id) =>
  fetch(`${API}/api/projects/${id}`, { credentials: "include" }).then(handle);

export const getProjectsByUsername = (username) =>
  fetch(`${API}/api/projects/user/${username}`, {
    credentials: "include",
  }).then(handle);

export const searchProjects = ({
  q = "",
  genre = "",
  status = "",
  role = "",
} = {}) =>
  fetch(
    `${API}/api/projects/search?q=${encodeURIComponent(q)}&genre=${encodeURIComponent(genre)}&status=${encodeURIComponent(status)}&role=${encodeURIComponent(role)}`,
    { credentials: "include" },
  ).then(handle);

export const createProject = (data) =>
  fetch(`${API}/api/projects`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handle);

export const updateProject = (id, data) =>
  fetch(`${API}/api/projects/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handle);

export const deleteProject = (id) =>
  fetch(`${API}/api/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
  }).then(handle);

export const uploadProjectCover = (id, file) => {
  const fd = new FormData();
  fd.append("cover", file);
  return fetch(`${API}/api/projects/${id}/cover`, {
    method: "PATCH",
    credentials: "include",
    body: fd,
  }).then(handle);
};

export const removeCollaborator = (projectId, userId) =>
  fetch(`${API}/api/projects/${projectId}/collaborators/${userId}`, {
    method: "DELETE",
    credentials: "include",
  }).then(handle);
