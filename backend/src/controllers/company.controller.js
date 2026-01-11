import Company from "../models/Company.js";
import connectDB from "../config/db.js";
import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to upload image (compatible with disk + memory storage)
const uploadImage = async (file, folder = "company") => {
  if (!file) return "";

  // Vercel / memory storage → use buffer
  if (file.buffer) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder },
        (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }
      );
      stream.end(file.buffer);
    });
  }

  // Local disk storage → use file.path
  if (file.path) {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder,
    });
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      // ignore
    }
    return result.secure_url;
  }

  return "";
};

// GET company data (or create default if none exists)
export const getCompany = async (req, res) => {
  try {
    await connectDB();
    
    let company = await Company.findOne();
    
    // If no company exists, create a default one
    if (!company) {
      company = await Company.create({});
    }
    
    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE company data
export const updateCompany = async (req, res) => {
  try {
    await connectDB();

    const updateData = {};

    // Handle text fields
    if (req.body.company !== undefined) updateData.company = req.body.company;
    if (req.body.slogan !== undefined) updateData.slogan = req.body.slogan;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.phone !== undefined) updateData.phone = req.body.phone;
    if (req.body.supportEmail !== undefined) updateData.supportEmail = req.body.supportEmail;
    if (req.body.address !== undefined) updateData.address = req.body.address;

    // Handle social links (JSON string)
    if (req.body.socialLinks) {
      try {
        updateData.socialLinks = typeof req.body.socialLinks === 'string' 
          ? JSON.parse(req.body.socialLinks) 
          : req.body.socialLinks;
      } catch (e) {
        console.error("Error parsing socialLinks:", e);
      }
    }

    // Handle social posts (JSON string)
    if (req.body.socialPosts) {
      try {
        updateData.socialPosts = typeof req.body.socialPosts === 'string'
          ? JSON.parse(req.body.socialPosts)
          : req.body.socialPosts;
        console.log("Social Posts received:", JSON.stringify(updateData.socialPosts, null, 2));
      } catch (e) {
        console.error("Error parsing socialPosts:", e);
      }
    }

    // Handle brand theme (JSON string)
    if (req.body.brandTheme) {
      try {
        updateData.brandTheme = typeof req.body.brandTheme === 'string'
          ? JSON.parse(req.body.brandTheme)
          : req.body.brandTheme;
      } catch (e) {
        console.error("Error parsing brandTheme:", e);
      }
    }

    // Handle file uploads
    // With upload.any(), req.files is an array, not an object
    if (req.files && Array.isArray(req.files)) {
      console.log("Files received:", req.files.length, "files");
      console.log("File fieldnames:", req.files.map(f => f.fieldname));
      
      // Create a map of fieldname -> file for easier access
      const filesMap = {};
      req.files.forEach(file => {
        if (!filesMap[file.fieldname]) {
          filesMap[file.fieldname] = [];
        }
        filesMap[file.fieldname].push(file);
      });
      
      console.log("Files map keys:", Object.keys(filesMap));

      // Upload logo if provided
      if (filesMap.logo && filesMap.logo[0]) {
        const logoUrl = await uploadImage(filesMap.logo[0], "company");
        if (logoUrl) {
          updateData.logo = logoUrl;
        }
      }

      // Upload favicon if provided
      if (filesMap.favicon && filesMap.favicon[0]) {
        const faviconUrl = await uploadImage(filesMap.favicon[0], "company");
        if (faviconUrl) {
          updateData.favicon = faviconUrl;
        }
      }

      // Handle social post images
      if (updateData.socialPosts && Array.isArray(updateData.socialPosts)) {
        // Get file indices if provided
        let fileIndices = [];
        if (req.body.socialPostFileIndices) {
          try {
            fileIndices = typeof req.body.socialPostFileIndices === 'string'
              ? JSON.parse(req.body.socialPostFileIndices)
              : req.body.socialPostFileIndices;
          } catch (e) {
            console.error("Error parsing socialPostFileIndices:", e);
          }
        }

        // Upload social post images
        console.log("File indices to process:", fileIndices);
        for (const index of fileIndices) {
          const fileKey = `socialPost_${index}`;
          console.log(`Processing social post ${index}, fileKey: ${fileKey}`);
          if (filesMap[fileKey] && filesMap[fileKey][0]) {
            console.log(`Uploading file for social post ${index}`);
            const imageUrl = await uploadImage(filesMap[fileKey][0], "company/social-posts");
            console.log(`Uploaded image URL for social post ${index}:`, imageUrl);
            if (imageUrl && updateData.socialPosts[index]) {
              updateData.socialPosts[index].image = imageUrl;
              console.log(`Updated social post ${index} with image URL:`, imageUrl);
            } else {
              console.warn(`Failed to update social post ${index}:`, { imageUrl, postExists: !!updateData.socialPosts[index] });
            }
          } else {
            console.warn(`No file found for social post ${index}, fileKey: ${fileKey}`);
          }
        }
        console.log("Final social posts after upload:", JSON.stringify(updateData.socialPosts, null, 2));
      }
    }

    // Find existing company or create new one
    let company = await Company.findOne();
    
    if (company) {
      // Update existing
      company = await Company.findByIdAndUpdate(
        company._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      company = await Company.create(updateData);
    }

    res.json({ success: true, data: company });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
