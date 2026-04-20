export const apiFetch = async (url, options = {}) => {
  let res = await fetch(API + url, {
    ...options,
    credentials: "include",
  });

  // ❌ Skip refresh for auth check
  if (res.status === 401 && url !== "/api/auth/me") {
    const refreshRes = await fetch(API + "/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      res = await fetch(API + url, {
        ...options,
        credentials: "include",
      });
    } else {
      window.location.href = "/login";
      return;
    }
  }

  return res;
};
