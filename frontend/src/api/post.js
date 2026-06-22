const API = `${import.meta.env.VITE_API_URL}/api/posts`;

// GET POSTS
export const getPosts = async () => {
  const res = await fetch(API, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch posts");

  return res.json();
};

// CREATE POST
export const createPost = async (postData) => {
  const res = await fetch(API, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!res.ok) throw new Error("Failed to create post");

  return res.json();
};

// LIKE POST
export const toggleLike = async (postId) => {
  const res = await fetch(`${API}/${postId}/like`, {
    method: "PUT",
    credentials: "include",
  });

  return res.json();
};
