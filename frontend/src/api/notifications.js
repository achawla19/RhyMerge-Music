export const getNotifications = async () => {
  const res = await fetch("http://localhost:5000/api/notifications", {
    credentials: "include",
  });

  return res.json();
};

export const markNotificationRead = async (id) => {
  await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
    method: "PUT",
    credentials: "include",
  });
};
