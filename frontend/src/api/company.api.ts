import API from "./axios";

export const getCompany = async () => {
  const res = await API.get("/company");
  return res.data.data;
};

export const updateCompany = async (data: any) => {
  const formData = new FormData();

  // Append text fields
  if (data.company !== undefined) formData.append("company", data.company);
  if (data.slogan !== undefined) formData.append("slogan", data.slogan);
  if (data.email !== undefined) formData.append("email", data.email);
  if (data.phone !== undefined) formData.append("phone", data.phone);
  if (data.supportEmail !== undefined) formData.append("supportEmail", data.supportEmail);
  if (data.address !== undefined) formData.append("address", data.address);
  
  // Append logo file
  if (data.logoFile instanceof File) {
    formData.append("logo", data.logoFile);
  }
  
  // Append favicon file
  if (data.faviconFile instanceof File) {
    formData.append("favicon", data.faviconFile);
  }

  // Append social links
  if (data.socialLinks) {
    formData.append("socialLinks", JSON.stringify(data.socialLinks));
  }

  // Append social posts
  if (data.socialPosts) {
    formData.append("socialPosts", JSON.stringify(data.socialPosts));
  }

  // Append brand theme
  if (data.brandTheme) {
    formData.append("brandTheme", JSON.stringify(data.brandTheme));
  }

  const res = await API.put("/company", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};










