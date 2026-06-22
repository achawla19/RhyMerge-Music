const API_URL = `${import.meta.env.VITE_API_URL}/api/search`;

export const globalSearch = async (query) => {
  const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`, {
    credentials: "include",
  });
  return res.json();
};
