const API = `${import.meta.env.VITE_API_URL}/api/project-requests`;

export const createProjectRequest = async (payload) => {
  const res = await fetch(API, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const getProjectRequests = async (projectId) => {
  const res = await fetch(`${API}/project/${projectId}`, {
    credentials: "include",
  });
  return res.json();
};

export const acceptRequest = async (id) => {
  const res = await fetch(`${API}/accept/${id}`, {
    method: "PATCH",
    credentials: "include",
  });
  return res.json();
};

export const rejectRequest = async (id) => {
  const res = await fetch(`${API}/reject/${id}`, {
    method: "PATCH",
    credentials: "include",
  });
  return res.json();
};

export const getMyProjectRequest = async (projectId) => {
  const res = await fetch(`${API}/mine/${projectId}`, {
    credentials: "include",
  });
  return res.json();
};
