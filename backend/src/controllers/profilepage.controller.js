import ProfilePage from "../models/ProfilePage.js";
import connectDB from "../config/db.js";

// GET ALL profile pages
export const getProfilePages = async (req, res) => {
  try {
    await connectDB();
    const pages = await ProfilePage.find().sort({ order: 1 });
    res.json({ success: true, data: pages });
  } catch (error) {
    console.error("Error fetching profile pages:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile pages" });
  }
};

// GET enabled profile pages only
export const getEnabledProfilePages = async (req, res) => {
  try {
    await connectDB();
    const pages = await ProfilePage.find({ enabled: true }).sort({ order: 1 });
    res.json({ success: true, data: pages });
  } catch (error) {
    console.error("Error fetching enabled profile pages:", error);
    res.status(500).json({ success: false, message: "Failed to fetch enabled profile pages" });
  }
};

// GET profile page by slug
export const getProfilePageBySlug = async (req, res) => {
  try {
    await connectDB();
    const page = await ProfilePage.findOne({ slug: req.params.slug, enabled: true });
    if (!page) {
      return res.status(404).json({ success: false, message: "Profile page not found" });
    }
    res.json({ success: true, data: page });
  } catch (error) {
    console.error("Error fetching profile page:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile page" });
  }
};

// CREATE profile page
export const createProfilePage = async (req, res) => {
  try {
    await connectDB();
    const page = await ProfilePage.create(req.body);
    res.json({ success: true, data: page });
  } catch (error) {
    console.error("Error creating profile page:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Slug already exists" });
    }
    res.status(500).json({ success: false, message: "Failed to create profile page" });
  }
};

// UPDATE profile page
export const updateProfilePage = async (req, res) => {
  try {
    await connectDB();
    const page = await ProfilePage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!page) {
      return res.status(404).json({ success: false, message: "Profile page not found" });
    }
    res.json({ success: true, data: page });
  } catch (error) {
    console.error("Error updating profile page:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Slug already exists" });
    }
    res.status(500).json({ success: false, message: "Failed to update profile page" });
  }
};

// DELETE profile page
export const deleteProfilePage = async (req, res) => {
  try {
    await connectDB();
    const page = await ProfilePage.findByIdAndDelete(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: "Profile page not found" });
    }
    res.json({ success: true, message: "Profile page deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile page:", error);
    res.status(500).json({ success: false, message: "Failed to delete profile page" });
  }
};

