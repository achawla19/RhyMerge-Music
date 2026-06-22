const API = `${import.meta.env.VITE_API_URL}/api/project-files`;

export const getProjectFiles = async (projectId) => {
  const res = await fetch(`${API}/${projectId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load files");
  return res.json();
};

export const uploadProjectFile = async (projectId, file, notes, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  if (notes) formData.append("notes", notes);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          reject(new Error(data.msg || "Upload failed"));
        }
      } catch {
        reject(new Error("Upload failed"));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Upload failed — check your connection")),
    );

    xhr.open("POST", `${API}/${projectId}`);
    xhr.withCredentials = true;
    xhr.send(formData);
  });
};

export const deleteProjectFile = async (fileId) => {
  const res = await fetch(`${API}/${fileId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.msg || "Failed to delete file");
  }
  return res.json();
};
