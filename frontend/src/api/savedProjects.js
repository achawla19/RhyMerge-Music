const API = `${import.meta.env.VITE_API_URL}/api/saved-projects`;

export const toggleSavedProject = async (projectId) => {
  const res = await fetch(`${API}/toggle`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId }),
  });
  return res.json();
};

export const getSavedProjects = async () => {
  const res = await fetch(API, { credentials: "include" });
  return res.json();
};
