const API_URL = `${import.meta.env.VITE_API_URL}/api/projects`;

export const getProjects = async () => {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg);
  }

  return data;
};

export const getProjectsByUsername = async (username) => {
  const response = await fetch(`${API_URL}/user/${username}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg);
  }

  return data;
};

export const createProject = async (payload) => {
  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg);
  }

  return data;
};

export const searchProjects = async ({ q = "", genre = "" }) => {
  const query = new URLSearchParams();

  if (q) query.append("q", q);
  if (genre) query.append("genre", genre);

  const res = await fetch(
    `http://localhost:5000/api/projects/search?${query}`,
    {
      credentials: "include",
    },
  );

  return res.json();
};
