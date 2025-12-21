import Footer from "../models/Footer.js";

// GET footer settings
export const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    
    if (!footer) {
      footer = await Footer.create({
        sections: [],
        socialLinks: {},
        copyright: "",
        description: "",
        showPreview: true,
      });
    }
    
    res.json({ success: true, data: footer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE footer settings
export const updateFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    
    if (!footer) {
      footer = await Footer.create({});
    }

    const updated = await Footer.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};










