import API from "./axios";

export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const getMe = async (token: string) => {
  const res = await API.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (data: { name: string; email: string }, token: string) =>
  API.put("/auth/update-profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const changePassword = async (data: { oldPassword: string; newPassword: string }, token: string) =>
  API.put("/auth/change-password", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAvatar = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await API.put("/auth/update-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  // If avatar is already a full URL (Cloudinary), use it as-is, otherwise prepend API URL
  // Use same logic as axios.ts to get correct API URL for production
  const urls = (import.meta.env.VITE_API_URLS || "").split(",").map((url: string) => url.trim()).filter(Boolean);
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1"
  );
  const API_BASE_URL = isLocalhost ? urls[0] : (urls[1] || urls[0] || import.meta.env.VITE_API_URL || "");
  const apiBaseWithoutApi = API_BASE_URL ? API_BASE_URL.replace('/api', '') : '';
  
  // Cloudinary URLs are already full URLs, use as-is
  // Also handle relative paths from backend
  let avatarUrl = res.data.avatar;
  if (avatarUrl) {
    // If it's already a full URL (Cloudinary or any other), use as-is
    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      // Already a full URL - use directly (Cloudinary URLs are like https://res.cloudinary.com/...)
      avatarUrl = avatarUrl;
    } else {
      // Relative path - construct full URL
      avatarUrl = `${apiBaseWithoutApi}${avatarUrl.startsWith('/') ? avatarUrl : '/' + avatarUrl}`;
    }
  }

  return {
    ...res.data,
    avatar: avatarUrl,
  };
};

// export const forgotPassword = async (email: string) => {
//   const res = await API.post("/auth/forgot-password", { email });
//   return res.data;
// };

// Reset password (with token)
// export const resetPassword = async (token: string, newPassword: string) => {
//   const res = await API.post(`/auth/reset-password/${token}`, { password: newPassword });
//   return res.data;
// };