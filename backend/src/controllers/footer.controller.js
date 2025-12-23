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
    
    // Explicitly handle showPreview to ensure boolean value is saved (including false)
    const updateData = { ...req.body };
    
    // Always set showPreview explicitly if it's provided (handles both true and false)
    if (req.body.showPreview !== undefined) {
      // Explicitly convert to boolean - handle all cases
      if (req.body.showPreview === false || req.body.showPreview === "false" || req.body.showPreview === 0 || req.body.showPreview === "0") {
        updateData.showPreview = false;
      } else {
        updateData.showPreview = true;
      }
    }

    console.log("Backend received updateData:", JSON.stringify(updateData));
    console.log("showPreview value:", updateData.showPreview, "type:", typeof updateData.showPreview);

    if (!footer) {
      // Create new footer with the update data
      footer = await Footer.create(updateData);
    } else {
      // Update existing footer - use $set to ensure false values are saved
      footer = await Footer.findOneAndUpdate(
        { _id: footer._id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    console.log("Backend saved footer - showPreview:", footer.showPreview);
    res.json({ success: true, data: footer });
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};











