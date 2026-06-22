const API = `${import.meta.env.VITE_API_URL}/api/posts`;

export const addComment = async (postId, text) => {
  const res = await fetch(`${API}/${postId}/comment`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
};

export const addReply = async (postId, commentId, text) => {
  const res = await fetch(`${API}/${postId}/comment/${commentId}/reply`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
};
