import axios from "axios";

const urls = import.meta.env.VITE_API_URLS.split(",");
const API_URL = window.location.hostname === "localhost" ? urls[0] : urls[1];

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important if your backend uses cookies/auth
});

// Optional: Add token automatically if stored in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
