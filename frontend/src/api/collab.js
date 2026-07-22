const API = `${import.meta.env.VITE_API_URL}/api/collab`;

const handle = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || "Something went wrong");
  return data;
};

// BROWSE / FILTER
export const getCollabPosts = (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null),
  ).toString();
  return fetch(`${API}${qs ? `?${qs}` : ""}`, { credentials: "include" }).then(
    handle,
  );
};

export const getCollabPostById = (id) =>
  fetch(`${API}/${id}`, { credentials: "include" }).then(handle);

export const getMyCollabPosts = () =>
  fetch(`${API}/mine`, { credentials: "include" }).then(handle);

// CREATE / EDIT / DELETE
export const createCollabPost = (payload) =>
  fetch(API, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handle);

export const updateCollabPost = (id, payload) =>
  fetch(`${API}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handle);

export const deleteCollabPost = (id) =>
  fetch(`${API}/${id}`, { method: "DELETE", credentials: "include" }).then(
    handle,
  );

// REACHING OUT
export const respondToCollab = (id, message) =>
  fetch(`${API}/${id}/respond`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  }).then(handle);

export const getCollabResponses = (id) =>
  fetch(`${API}/${id}/responses`, { credentials: "include" }).then(handle);

export const getMyResponseStatus = (id) =>
  fetch(`${API}/${id}/my-response`, { credentials: "include" }).then(handle);

export const acceptResponse = (responseId) =>
  fetch(`${API}/responses/${responseId}/accept`, {
    method: "PATCH",
    credentials: "include",
  }).then(handle);

export const declineResponse = (responseId) =>
  fetch(`${API}/responses/${responseId}/decline`, {
    method: "PATCH",
    credentials: "include",
  }).then(handle);
