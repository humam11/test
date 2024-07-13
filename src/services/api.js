import axios from "axios";

const BASE_URL = "https://js-test.kitactive.ru/api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (userData) => api.post("/register", userData);
export const login = (credentials) => api.post("/login", credentials);
export const logout = () => api.post("/logout");

export const getFiles = () => api.get("/media");
export const uploadFile = (file) => api.post("/media/upload", file);
export const deleteFile = (id) => api.delete(`/media/${id}`);

export default api;
