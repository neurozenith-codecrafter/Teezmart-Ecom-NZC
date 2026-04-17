export const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const buildApiUrl = (path) => {
  if (!path) {
    return API_BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
