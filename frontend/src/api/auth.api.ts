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

  return {
    ...res.data,
    avatar: res.data.avatar ? `${import.meta.env.VITE_API_URL}${res.data.avatar}` : undefined,
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