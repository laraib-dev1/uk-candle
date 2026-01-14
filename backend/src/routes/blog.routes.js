import express from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  incrementBlogViews,
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogAuthors,
  getBlogAuthorById,
  createBlogAuthor,
  updateBlogAuthor,
  deleteBlogAuthor,
  getBlogStats,
} from "../controllers/blog.controller.js";
import { protect, isAdmin } from "../middleware/auth.js";
import { uploadMultiple } from "../middleware/upload.js";

const router = express.Router();

// Blog routes
router.get("/", getBlogs);
router.get("/stats", getBlogStats);
router.get("/:id", getBlogById);
router.post("/", protect, isAdmin, uploadMultiple.single("image"), createBlog);
router.put("/:id", protect, isAdmin, uploadMultiple.single("image"), updateBlog);
router.delete("/:id", protect, isAdmin, deleteBlog);
router.patch("/:id/views", incrementBlogViews);

// Category routes
router.get("/categories/all", getBlogCategories);
router.post("/categories", protect, isAdmin, createBlogCategory);
router.put("/categories/:id", protect, isAdmin, updateBlogCategory);
router.delete("/categories/:id", protect, isAdmin, deleteBlogCategory);

// Author routes
router.get("/authors/all", getBlogAuthors);
router.get("/authors/:id", getBlogAuthorById);
router.post("/authors", protect, isAdmin, uploadMultiple.single("avatar"), createBlogAuthor);
router.put("/authors/:id", protect, isAdmin, uploadMultiple.single("avatar"), updateBlogAuthor);
router.delete("/authors/:id", protect, isAdmin, deleteBlogAuthor);

export default router;
