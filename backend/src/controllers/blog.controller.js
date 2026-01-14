import connectDB from "../config/db.js";
import Blog from "../models/Blog.js";
import BlogCategory from "../models/BlogCategory.js";
import BlogAuthor from "../models/BlogAuthor.js";
import cloudinary from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload helper
const uploadToCloud = async (file) => {
  if (!file) return "";
  if (file.buffer) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: "blogs" },
        (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }
      );
      stream.end(file.buffer);
    });
  }
  if (file.path) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    try {
      fs.unlinkSync(file.path);
    } catch (e) {}
    return result.secure_url;
  }
  return "";
};

// ==================== BLOG CRUD ====================

// GET all blogs
export const getBlogs = async (req, res) => {
  try {
    await connectDB();
    const blogs = await Blog.find()
      .populate("category", "name")
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single blog by ID
export const getBlogById = async (req, res) => {
  try {
    await connectDB();
    const blog = await Blog.findById(req.params.id)
      .populate("category", "name")
      .populate("author", "name email avatar bio socialLinks");
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE blog
export const createBlog = async (req, res) => {
  try {
    await connectDB();
    
    // Handle form data parsing
    let tags = [];
    try {
      if (req.body.tags) {
        tags = typeof req.body.tags === "string" ? JSON.parse(req.body.tags) : req.body.tags;
      }
    } catch (e) {
      tags = Array.isArray(req.body.tags) ? req.body.tags : [];
    }

    const { title, subTitle, description, category, author, image, status } = req.body;

    if (!title || !description || !category || !author) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Handle image upload
    let imageUrl = image || "";
    if (req.files && req.files.image && req.files.image[0]) {
      imageUrl = await uploadToCloud(req.files.image[0]);
    }

    const blog = new Blog({
      title,
      subTitle: subTitle || "",
      description,
      category,
      author,
      tags: Array.isArray(tags) ? tags : [],
      image: imageUrl,
      status: status || "draft",
    });

    await blog.save();

    // Update category blog count
    await BlogCategory.findByIdAndUpdate(category, { $inc: { blogs: 1 } });
    // Update author blog count
    await BlogAuthor.findByIdAndUpdate(author, { $inc: { blogs: 1 } });

    const populatedBlog = await Blog.findById(blog._id)
      .populate("category", "name")
      .populate("author", "name email avatar");

    res.status(201).json({ success: true, data: populatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE blog
export const updateBlog = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    // Handle tags parsing
    let tags = [];
    try {
      if (req.body.tags) {
        tags = typeof req.body.tags === "string" ? JSON.parse(req.body.tags) : req.body.tags;
      }
    } catch (e) {
      tags = Array.isArray(req.body.tags) ? req.body.tags : [];
    }

    const { title, subTitle, description, category, author, image, status } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Track category and author changes for count updates
    const oldCategory = blog.category.toString();
    const oldAuthor = blog.author.toString();

    blog.title = title || blog.title;
    blog.subTitle = subTitle !== undefined ? subTitle : blog.subTitle;
    blog.description = description || blog.description;
    blog.tags = Array.isArray(tags) && tags.length > 0 ? tags : blog.tags;
    blog.status = status || blog.status;

    // Handle image upload
    if (req.files && req.files.image && req.files.image[0]) {
      blog.image = await uploadToCloud(req.files.image[0]);
    } else if (image !== undefined) {
      blog.image = image;
    }

    if (category && category !== oldCategory) {
      blog.category = category;
      // Decrement old category, increment new
      await BlogCategory.findByIdAndUpdate(oldCategory, { $inc: { blogs: -1 } });
      await BlogCategory.findByIdAndUpdate(category, { $inc: { blogs: 1 } });
    }

    if (author && author !== oldAuthor) {
      blog.author = author;
      // Decrement old author, increment new
      await BlogAuthor.findByIdAndUpdate(oldAuthor, { $inc: { blogs: -1 } });
      await BlogAuthor.findByIdAndUpdate(author, { $inc: { blogs: 1 } });
    }

    await blog.save();

    const populatedBlog = await Blog.findById(blog._id)
      .populate("category", "name")
      .populate("author", "name email avatar");

    res.status(200).json({ success: true, data: populatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE blog
export const deleteBlog = async (req, res) => {
  try {
    await connectDB();
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const categoryId = blog.category.toString();
    const authorId = blog.author.toString();

    await Blog.findByIdAndDelete(req.params.id);

    // Decrement counts
    await BlogCategory.findByIdAndUpdate(categoryId, { $inc: { blogs: -1 } });
    await BlogAuthor.findByIdAndUpdate(authorId, { $inc: { blogs: -1 } });

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Increment views
export const incrementBlogViews = async (req, res) => {
  try {
    await connectDB();
    await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== BLOG CATEGORY CRUD ====================

// GET all categories
export const getBlogCategories = async (req, res) => {
  try {
    await connectDB();
    const categories = await BlogCategory.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE category
export const createBlogCategory = async (req, res) => {
  try {
    await connectDB();
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    const category = new BlogCategory({ name });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE category
export const updateBlogCategory = async (req, res) => {
  try {
    await connectDB();
    const category = await BlogCategory.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE category
export const deleteBlogCategory = async (req, res) => {
  try {
    await connectDB();
    // Check if any blogs use this category
    const blogsCount = await Blog.countDocuments({ category: req.params.id });
    if (blogsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${blogsCount} blog(s) are using it.`,
      });
    }
    await BlogCategory.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== BLOG AUTHOR CRUD ====================

// GET all authors
export const getBlogAuthors = async (req, res) => {
  try {
    await connectDB();
    const authors = await BlogAuthor.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: authors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single author by ID
export const getBlogAuthorById = async (req, res) => {
  try {
    await connectDB();
    const author = await BlogAuthor.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ success: false, message: "Author not found" });
    }
    res.status(200).json({ success: true, data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE author
export const createBlogAuthor = async (req, res) => {
  try {
    await connectDB();
    
    // Handle socialLinks parsing
    let socialLinks = {};
    try {
      if (req.body.socialLinks) {
        socialLinks = typeof req.body.socialLinks === "string" ? JSON.parse(req.body.socialLinks) : req.body.socialLinks;
      }
    } catch (e) {
      socialLinks = typeof req.body.socialLinks === "object" ? req.body.socialLinks : {};
    }

    const { name, email, bio, avatar } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    // Handle avatar upload
    let avatarUrl = avatar || "";
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      avatarUrl = await uploadToCloud(req.files.avatar[0]);
    }

    const author = new BlogAuthor({
      name,
      email,
      bio: bio || "",
      avatar: avatarUrl,
      socialLinks: socialLinks || {},
    });
    await author.save();
    res.status(201).json({ success: true, data: author });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Author with this email already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE author
export const updateBlogAuthor = async (req, res) => {
  try {
    await connectDB();
    
    // Handle socialLinks parsing
    let socialLinks = {};
    try {
      if (req.body.socialLinks) {
        socialLinks = typeof req.body.socialLinks === "string" ? JSON.parse(req.body.socialLinks) : req.body.socialLinks;
      }
    } catch (e) {
      socialLinks = typeof req.body.socialLinks === "object" ? req.body.socialLinks : {};
    }

    const updateData = { ...req.body };
    if (Object.keys(socialLinks).length > 0) {
      updateData.socialLinks = socialLinks;
    }

    // Handle avatar upload
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      updateData.avatar = await uploadToCloud(req.files.avatar[0]);
    }

    const author = await BlogAuthor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!author) {
      return res.status(404).json({ success: false, message: "Author not found" });
    }
    res.status(200).json({ success: true, data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE author
export const deleteBlogAuthor = async (req, res) => {
  try {
    await connectDB();
    // Check if any blogs use this author
    const blogsCount = await Blog.countDocuments({ author: req.params.id });
    if (blogsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete author. ${blogsCount} blog(s) are using this author.`,
      });
    }
    await BlogAuthor.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Author deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== BLOG STATS ====================

// GET blog statistics for dashboard
export const getBlogStats = async (req, res) => {
  try {
    await connectDB();
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: "published" });
    const unpublishedBlogs = await Blog.countDocuments({ status: "unpublished" });
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);
    const totalComments = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: "$comments" } } },
    ]);
    const totalAuthors = await BlogAuthor.countDocuments();
    const totalCategories = await BlogCategory.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalBlogs,
        published: publishedBlogs,
        unpublished: unpublishedBlogs,
        totalViews: totalViews[0]?.total || 0,
        totalComments: totalComments[0]?.total || 0,
        totalAuthors,
        totalCategories,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
