import WebPage from "../models/WebPage.js";

// GET ALL web pages
export const getWebPages = async (req, res) => {
  try {
    const pages = await WebPage.find().sort({ order: 1 });
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET enabled web pages only (for navbar/footer)
export const getEnabledWebPages = async (req, res) => {
  try {
    const pages = await WebPage.find({ enabled: true }).sort({ order: 1 });
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET enabled web pages by location (for footer/navbar)
export const getEnabledWebPagesByLocation = async (req, res) => {
  try {
    const { location } = req.params; // "nav", "footer", or "both"
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
    await WebPage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

