import AdminTab from "../models/AdminTab.js";
import connectDB from "../config/db.js";

// GET ALL admin tabs
export const getAdminTabs = async (req, res) => {
  try {
    await connectDB();
    
    // Auto-create Queries tab if it doesn't exist
    let queriesTab = await AdminTab.findOne({ path: "/admin/queries" });
    if (!queriesTab) {
      try {
        queriesTab = await AdminTab.create({
          label: "Queries",
          path: "/admin/queries",
          icon: "MessageSquare",
          enabled: true,
          order: 2, // After Orders
          subInfo: "Manage customer queries",
        });
        console.log("✅ Auto-created Queries admin tab");
      } catch (createError) {
        console.error("Failed to auto-create Queries tab:", createError);
        // Continue even if creation fails (might already exist)
      }
    }
    
    // Always fetch all tabs after potential creation
    const tabs = await AdminTab.find().sort({ order: 1 });
    res.json({ success: true, data: tabs });
  } catch (error) {
    console.error("Error in getAdminTabs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET enabled admin tabs only (for admin sidebar)
export const getEnabledAdminTabs = async (req, res) => {
  try {
    await connectDB();
    
    // Auto-create Queries tab if it doesn't exist
    let queriesTab = await AdminTab.findOne({ path: "/admin/queries" });
    if (!queriesTab) {
      try {
        queriesTab = await AdminTab.create({
          label: "Queries",
          path: "/admin/queries",
          icon: "MessageSquare",
          enabled: true,
          order: 2, // After Orders
          subInfo: "Manage customer queries",
        });
        console.log("✅ Auto-created Queries admin tab");
      } catch (createError) {
        console.error("Failed to auto-create Queries tab:", createError);
      }
    }
    
    // Always fetch enabled tabs after potential creation
    const tabs = await AdminTab.find({ enabled: true }).sort({ order: 1 });
    res.json({ success: true, data: tabs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE admin tab
export const createAdminTab = async (req, res) => {
  try {
    await connectDB();
    
    const tab = await AdminTab.create({
      label: req.body.label,
      path: req.body.path,
      icon: req.body.icon || "",
      enabled: req.body.enabled !== undefined ? req.body.enabled : true,
      order: req.body.order || 0,
      subInfo: req.body.subInfo || "",
    });
    res.status(201).json({ success: true, data: tab });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE admin tab
export const updateAdminTab = async (req, res) => {
  try {
    await connectDB();
    
    const tab = await AdminTab.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!tab) {
      return res.status(404).json({ success: false, message: "Tab not found" });
    }
    res.json({ success: true, data: tab });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE admin tab
export const deleteAdminTab = async (req, res) => {
  try {
    await connectDB();
    
    await AdminTab.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Tab deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};













