export const toggleSavedProject = async (projectId) => {
  const res = await fetch("http://localhost:5000/api/saved-projects/toggle", {
    method: "POST",

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      projectId,
    }),
  });

  return res.json();
};

export const getSavedProjects = async () => {
  const res = await fetch("http://localhost:5000/api/saved-projects", {
    credentials: "include",
  });

  return res.json();
};
