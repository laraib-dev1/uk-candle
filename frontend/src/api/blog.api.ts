import API from "./axios";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

// Helper to get full image URL
const getFullImageUrl = (img: string | null | undefined): string => {
  if (!img || img.trim() === "") return "/product.png";
  if (img.startsWith("http") || img === "/product.png") return img;
  return `${BASE_URL}${img}`;
};

// ==================== BLOG TYPES ====================
export interface Blog {
  _id: string;
  title: string;
  subTitle?: string;
  description: string; // HTML content
  category: string | { _id: string; name: string };
  author: string | { _id: string; name: string; email: string; avatar?: string };
  tags: string[];
  image: string;
  status: "published" | "unpublished" | "draft";
  views: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  _id: string;
  name: string;
  blogs: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogAuthor {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
  };
  blogs: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogStats {
  totalBlogs: number;
  published: number;
  unpublished: number;
  totalViews: number;
  totalComments: number;
  totalAuthors: number;
  totalCategories: number;
}

// ==================== BLOG CRUD ====================

export const getBlogs = async (): Promise<Blog[]> => {
  const res = await API.get("/blogs");
  const blogs = res.data.data || [];
  return blogs.map((blog: Blog) => ({
    ...blog,
    image: getFullImageUrl(blog.image),
  }));
};

export const getBlogById = async (id: string): Promise<Blog> => {
  const res = await API.get(`/blogs/${id}`);
  const blog = res.data.data;
  return {
    ...blog,
    image: getFullImageUrl(blog.image),
  };
};

export const createBlog = async (blogData: Partial<Blog>): Promise<Blog> => {
  const formData = new FormData();
  
  Object.entries(blogData).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  const res = await API.post("/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const blog = res.data.data;
  return {
    ...blog,
    image: getFullImageUrl(blog.image),
  };
};

export const updateBlog = async (id: string, blogData: Partial<Blog>): Promise<Blog> => {
  const formData = new FormData();
  
  Object.entries(blogData).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  const res = await API.put(`/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const blog = res.data.data;
  return {
    ...blog,
    image: getFullImageUrl(blog.image),
  };
};

export const deleteBlog = async (id: string): Promise<void> => {
  await API.delete(`/blogs/${id}`);
};

export const incrementBlogViews = async (id: string): Promise<void> => {
  await API.patch(`/blogs/${id}/views`);
};

// ==================== BLOG CATEGORY CRUD ====================

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  const res = await API.get("/blogs/categories/all");
  return res.data.data || [];
};

export const createBlogCategory = async (name: string): Promise<BlogCategory> => {
  const res = await API.post("/blogs/categories", { name });
  return res.data.data;
};

export const updateBlogCategory = async (id: string, name: string): Promise<BlogCategory> => {
  const res = await API.put(`/blogs/categories/${id}`, { name });
  return res.data.data;
};

export const deleteBlogCategory = async (id: string): Promise<void> => {
  await API.delete(`/blogs/categories/${id}`);
};

// ==================== BLOG AUTHOR CRUD ====================

export const getBlogAuthors = async (): Promise<BlogAuthor[]> => {
  const res = await API.get("/blogs/authors/all");
  return res.data.data || [];
};

export const getBlogAuthorById = async (id: string): Promise<BlogAuthor> => {
  const res = await API.get(`/blogs/authors/${id}`);
  const author = res.data.data;
  return {
    ...author,
    avatar: getFullImageUrl(author.avatar),
  };
};

export const createBlogAuthor = async (authorData: Partial<BlogAuthor>): Promise<BlogAuthor> => {
  const formData = new FormData();
  
  Object.entries(authorData).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  const res = await API.post("/blogs/authors", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const author = res.data.data;
  return {
    ...author,
    avatar: getFullImageUrl(author.avatar),
  };
};

export const updateBlogAuthor = async (id: string, authorData: Partial<BlogAuthor>): Promise<BlogAuthor> => {
  const formData = new FormData();
  
  Object.entries(authorData).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  const res = await API.put(`/blogs/authors/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const author = res.data.data;
  return {
    ...author,
    avatar: getFullImageUrl(author.avatar),
  };
};

export const deleteBlogAuthor = async (id: string): Promise<void> => {
  await API.delete(`/blogs/authors/${id}`);
};

// ==================== BLOG STATS ====================

export const getBlogStats = async (): Promise<BlogStats> => {
  const res = await API.get("/blogs/stats");
  return res.data.data;
};
