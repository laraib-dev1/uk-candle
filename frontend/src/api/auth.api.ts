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
// export const forgotPassword = async (email: string) => {
//   const res = await API.post("/auth/forgot-password", { email });
//   return res.data;
// };

// Reset password (with token)
// export const resetPassword = async (token: string, newPassword: string) => {
//   const res = await API.post(`/auth/reset-password/${token}`, { password: newPassword });
//   return res.data;
// };