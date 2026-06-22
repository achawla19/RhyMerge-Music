const API = `${import.meta.env.VITE_API_URL}/api/notifications`;

export const getNotifications = async () => {
  const res = await fetch(API, { credentials: "include" });
  return res.json();
};

export const markNotificationRead = async (id) => {
  await fetch(`${API}/${id}/read`, {
    method: "PUT",
    credentials: "include",
  });
};
