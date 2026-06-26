const API = import.meta.env.VITE_API_URL;

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Request failed");
  return data;
};

export const getNotifications = (page = 1) =>
  fetch(`${API}/api/notifications?page=${page}`, {
    credentials: "include",
  }).then(handle);

export const markNotificationRead = (id) =>
  fetch(`${API}/api/notifications/${id}/read`, {
    method: "PUT",
    credentials: "include",
  }).then(handle);

export const markAllNotificationsRead = () =>
  fetch(`${API}/api/notifications/read-all`, {
    method: "PUT",
    credentials: "include",
  }).then(handle);

export const deleteNotification = (id) =>
  fetch(`${API}/api/notifications/${id}`, {
    method: "DELETE",
    credentials: "include",
  }).then(handle);
