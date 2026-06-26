const API = import.meta.env.VITE_API_URL;

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Request failed");
  return data;
};

export const getProjectFiles = (projectId) =>
  fetch(`${API}/api/project-files/${projectId}`, {
    credentials: "include",
  }).then(handle);

export const uploadProjectFile = (
  projectId,
  file,
  { stemType = "other", notes = "", version = 1 } = {},
) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("stemType", stemType);
  fd.append("notes", notes);
  fd.append("version", String(version));
  return fetch(`${API}/api/project-files/${projectId}`, {
    method: "POST",
    credentials: "include",
    body: fd,
  }).then(handle);
};

export const deleteProjectFile = (fileId) =>
  fetch(`${API}/api/project-files/${fileId}`, {
    method: "DELETE",
    credentials: "include",
  }).then(handle);
