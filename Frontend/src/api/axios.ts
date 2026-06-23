import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
//console.log("API URL =", import.meta.env.VITE_API_BASE_URL);

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      // optional global handling
    }
    return Promise.reject(error);
  },
);

export default api;
