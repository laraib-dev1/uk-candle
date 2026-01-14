import axios from "axios";

const urls = (import.meta.env.VITE_API_URLS || "").split(",").map((url: string) => url.trim()).filter(Boolean);

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_URL = isLocalhost ? urls[0] : urls[1];

console.log("API Base URL:", API_URL); // debug

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // For user-specific endpoints, cancel request if no token to prevent 401 errors
  if (config.url?.includes('/user/') && !token) {
    // Cancel the request before it's sent
    return Promise.reject(new Error('No token - request cancelled'));
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to suppress 401 errors in console for unauthenticated requests
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress 401 errors completely - they're expected when user is not logged in
    if (error?.response?.status === 401) {
      // Create a silent error that won't be logged
      const silentError = new Error('Unauthorized');
      silentError.name = 'SilentError';
      return Promise.reject(silentError);
    }
    // For other errors, let them through normally
    return Promise.reject(error);
  }
);

export default API;
