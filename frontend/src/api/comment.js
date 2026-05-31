const API = "http://localhost:5000/api/posts";

export const addComment = async (postId, text) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/${postId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error("Failed to add comment");
  }

  return res.json();
};

export const addReply = async (postId, commentId, text) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/${postId}/comment/${commentId}/reply`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({ text }),
  });

  return res.json();
};
