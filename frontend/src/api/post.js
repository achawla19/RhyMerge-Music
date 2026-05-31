const API = "http://localhost:5000/api/posts";

// GET POSTS
export const getPosts = async () => {
  const res = await fetch(API);

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
};

// CREATE POST
export const createPost = async (postData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    throw new Error("Failed to create post");
  }

  return res.json();
};

// LIKE POST
export const toggleLike = async (postId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/${postId}/like`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
