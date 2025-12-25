import WebPage from "../models/WebPage.js";
import connectDB from "../config/db.js";

// GET ALL web pages
export const getWebPages = async (req, res) => {
  try {
    await connectDB();
    
    // Auto-create Contact Us page if it doesn't exist
    let contactPage = await WebPage.findOne({ slug: "/contact-us" });
    if (!contactPage) {
      try {
        contactPage = await WebPage.create({
          title: "Contact Us",
          slug: "/contact-us",
          icon: "",
          enabled: true,
          order: 100,
          subInfo: "Get in touch with us",
          location: "footer",
        });
        console.log("✅ Auto-created Contact Us webpage");
      } catch (createError) {
        console.error("Failed to auto-create Contact Us page:", createError);
        // Continue even if creation fails (might already exist)
      }
    }
    
    // Always fetch all pages after potential creation
    const pages = await WebPage.find().sort({ order: 1 });
    res.json({ success: true, data: pages });
  } catch (error) {
    console.error("Error in getWebPages:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET enabled web pages only (for navbar/footer)
export const getEnabledWebPages = async (req, res) => {
  try {
    await connectDB();
    
    // Auto-create Contact Us page if it doesn't exist
    let contactPage = await WebPage.findOne({ slug: "/contact-us" });
    if (!contactPage) {
      try {
        contactPage = await WebPage.create({
          title: "Contact Us",
          slug: "/contact-us",
          icon: "",
          enabled: true,
          order: 100,
          subInfo: "Get in touch with us",
          location: "footer",
        });
        console.log("✅ Auto-created Contact Us webpage");
      } catch (createError) {
        console.error("Failed to auto-create Contact Us page:", createError);
      }
    }
    
    // Always fetch enabled pages after potential creation
    const pages = await WebPage.find({ enabled: true }).sort({ order: 1 });
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET enabled web pages by location (for footer/navbar)
export const getEnabledWebPagesByLocation = async (req, res) => {
  try {
    await connectDB();
    
    const { location } = req.params; // "nav", "footer", or "both"
    
    // Auto-create Contact Us page if it doesn't exist and location is footer
    if (location === "footer" || location === "both") {
      let contactPage = await WebPage.findOne({ slug: "/contact-us" });
      if (!contactPage) {
        try {
          contactPage = await WebPage.create({
            title: "Contact Us",
            slug: "/contact-us",
            icon: "",
            enabled: true,
            order: 100,
            subInfo: "Get in touch with us",
            location: "footer",
          });
          console.log("✅ Auto-created Contact Us webpage");
        } catch (createError) {
          console.error("Failed to auto-create Contact Us page:", createError);
        }
      }
    }
    
    // Always fetch pages after potential creation
    const pages = await WebPage.find({ 
      enabled: true,
      $or: [
        { location: location },
        { location: "both" }
      ]
    }).sort({ order: 1 });
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE web page
export const createWebPage = async (req, res) => {
  try {
    await connectDB();
    
    const page = await WebPage.create({
      title: req.body.title,
      slug: req.body.slug,
      icon: req.body.icon || "",
      enabled: req.body.enabled !== undefined ? req.body.enabled : true,
      order: req.body.order || 0,
      subInfo: req.body.subInfo || "",
      location: req.body.location || "footer",
    });
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE web page
export const updateWebPage = async (req, res) => {
  try {
    await connectDB();
    
    const page = await WebPage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE web page
export const deleteWebPage = async (req, res) => {
  try {
    await connectDB();
    
    await WebPage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

