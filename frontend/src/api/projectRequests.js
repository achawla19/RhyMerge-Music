export const createProjectRequest = async (payload) => {
  const res = await fetch("http://localhost:5000/api/project-requests", {
    method: "POST",

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  return res.json();
};

export const getProjectRequests = async (projectId) => {
  const res = await fetch(
    `http://localhost:5000/api/project-requests/project/${projectId}`,
    {
      credentials: "include",
    },
  );

  return res.json();
};

export const acceptRequest = async (id) => {
  const res = await fetch(
    `http://localhost:5000/api/project-requests/accept/${id}`,
    {
      method: "PATCH",
      credentials: "include",
    },
  );

  return res.json();
};

export const rejectRequest = async (id) => {
  const res = await fetch(
    `http://localhost:5000/api/project-requests/reject/${id}`,
    {
      method: "PATCH",
      credentials: "include",
    },
  );

  return res.json();
};

export const getMyProjectRequest = async (projectId) => {
  const res = await fetch(
    `http://localhost:5000/api/project-requests/mine/${projectId}`,
    {
      credentials: "include",
    },
  );

  return res.json();
};
