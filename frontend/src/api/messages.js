const API = `${import.meta.env.VITE_API_URL}/api/messages`;

export const getConversations = async () => {
  const res = await fetch(`${API}/conversations`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load conversations");
  return res.json();
};

export const getMessagesWithUser = async (userId) => {
  const res = await fetch(`${API}/${userId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load messages");
  return res.json();
};
