import API from "./axios";

// ==================== BLOG OPERATIONS ====================

export const getBlogs = async (status?: string) => {
  const url = status && status !== "all" ? `/blogs?status=${status}` : "/blogs";
  const res = await API.get(url);
  return res.data.data;
};

export const getBlogById = async (id: string) => {
  const res = await API.get(`/blogs/${id}`);
  return res.data.data;
};

export const createBlog = async (blog: any) => {
  const formData = new FormData();
  formData.append("title", blog.title);
  formData.append("subTag", blog.subTag || "");
  formData.append("description", blog.description);
  formData.append("category", blog.category);
  if (blog.niche) formData.append("niche", blog.niche);
  formData.append("author", blog.author);
  formData.append("status", blog.status || "draft");
  
  if (blog.tags && Array.isArray(blog.tags)) {
    blog.tags.forEach((tag: string) => formData.append("tags", tag));
  } else if (blog.tags) {
    formData.append("tags", blog.tags);
  }
  
  if (blog.imageFile) {
    formData.append("image", blog.imageFile);
  }

  const res = await API.post("/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

export const updateBlog = async (id: string, blog: any) => {
  const formData = new FormData();
  formData.append("title", blog.title);
  formData.append("subTag", blog.subTag || "");
  formData.append("description", blog.description);
  formData.append("category", blog.category);
  if (blog.niche) formData.append("niche", blog.niche);
  formData.append("author", blog.author);
  formData.append("status", blog.status || "draft");
  
  if (blog.tags && Array.isArray(blog.tags)) {
    blog.tags.forEach((tag: string) => formData.append("tags", tag));
  } else if (blog.tags) {
    formData.append("tags", blog.tags);
  }
  
  if (blog.imageFile) {
    formData.append("image", blog.imageFile);
  }

  const res = await API.put(`/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

export const deleteBlog = async (id: string) => {
  const res = await API.delete(`/blogs/${id}`);
  return res.data.success;
};

export const getBlogStats = async () => {
  const res = await API.get("/blogs/stats");
  return res.data.data;
};

// ==================== CATEGORY OPERATIONS ====================

export const getBlogCategories = async () => {
  const res = await API.get("/blogs/categories/all");
  return res.data.data;
};

export const createBlogCategory = async (category: { name: string }) => {
  const res = await API.post("/blogs/categories", category);
  return res.data.data;
};

export const updateBlogCategory = async (id: string, category: { name: string }) => {
  const res = await API.put(`/blogs/categories/${id}`, category);
  return res.data.data;
};

export const deleteBlogCategory = async (id: string) => {
  const res = await API.delete(`/blogs/categories/${id}`);
  return res.data.success;
};

// ==================== NICHE OPERATIONS ====================

export const getBlogNiches = async (categoryId?: string) => {
  const url = categoryId ? `/blogs/niches/all?category=${categoryId}` : "/blogs/niches/all";
  const res = await API.get(url);
  return res.data.data;
};

export const createBlogNiche = async (niche: { name: string; category: string }) => {
  const res = await API.post("/blogs/niches", niche);
  return res.data.data;
};

export const updateBlogNiche = async (id: string, niche: { name: string; category: string }) => {
  const res = await API.put(`/blogs/niches/${id}`, niche);
  return res.data.data;
};

export const deleteBlogNiche = async (id: string) => {
  const res = await API.delete(`/blogs/niches/${id}`);
  return res.data.success;
};

// ==================== AUTHOR OPERATIONS ====================

export const getBlogAuthors = async () => {
  const res = await API.get("/blogs/authors/all");
  return res.data.data;
};

export const getBlogAuthorById = async (id: string) => {
  const res = await API.get(`/blogs/authors/${id}`);
  return res.data.data;
};

export const createBlogAuthor = async (author: any) => {
  const formData = new FormData();
  formData.append("name", author.name);
  formData.append("email", author.email);
  formData.append("bio", author.bio || "");
  formData.append("facebook", author.facebook || "");
  formData.append("tiktok", author.tiktok || "");
  formData.append("instagram", author.instagram || "");
  formData.append("youtube", author.youtube || "");
  formData.append("linkedin", author.linkedin || "");
  formData.append("other", author.other || "");
  
  if (author.avatarFile) {
    formData.append("avatar", author.avatarFile);
  }

  const res = await API.post("/blogs/authors", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

export const updateBlogAuthor = async (id: string, author: any) => {
  const formData = new FormData();
  formData.append("name", author.name);
  formData.append("email", author.email);
  formData.append("bio", author.bio || "");
  formData.append("facebook", author.facebook || "");
  formData.append("tiktok", author.tiktok || "");
  formData.append("instagram", author.instagram || "");
  formData.append("youtube", author.youtube || "");
  formData.append("linkedin", author.linkedin || "");
  formData.append("other", author.other || "");
  
  if (author.avatarFile) {
    formData.append("avatar", author.avatarFile);
  }

  const res = await API.put(`/blogs/authors/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

export const deleteBlogAuthor = async (id: string) => {
  const res = await API.delete(`/blogs/authors/${id}`);
  return res.data.success;
};
