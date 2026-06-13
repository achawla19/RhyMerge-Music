export const getRecommendations = async () => {
  const res = await fetch("http://localhost:5000/api/recommendations/users", {
    credentials: "include",
  });

  return res.json();
};
