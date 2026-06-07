const API_URL = "http://localhost:5000/api/search";

export const globalSearch = async (query) => {
  const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`, {
    credentials: "include",
  });

  return res.json();
};
