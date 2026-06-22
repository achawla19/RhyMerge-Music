const API = `${import.meta.env.VITE_API_URL}/api/recommendations`;

export const getRecommendations = async () => {
  const res = await fetch(`${API}/users`, { credentials: "include" });
  return res.json();
};
