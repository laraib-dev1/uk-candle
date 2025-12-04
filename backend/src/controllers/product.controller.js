// backend/src/controllers/product.controller.js
import Product from "../models/Product.js";
import "../models/Category.js";
import fs from "fs";
import path from "path";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload helper
const uploadToCloud = async (file) => {
  if (!file) return "";

  const filepath = file.filepath || file.path;  // support both local & Vercel

  const result = await cloudinary.v2.uploader.upload(filepath);

  fs.unlink(filepath, () => {});
  return result.secure_url;
};


// Remove local file helper
const uploadsPath = path.join(process.cwd(), "uploads");
const tryRemoveFileFromUrl = (url) => {
  if (!url) return;
  if (url.includes("/uploads/")) {
    const filename = url.split("/uploads/").pop();
    const filePath = path.join(uploadsPath, filename);
    fs.unlink(filePath, (err) => {
      if (err) console.warn("remove old file:", err.message);
    });
  }
};

// ---------------- CREATE PRODUCT ----------------
export const createProduct = async (req, res) => {
  try {
    // 🔥 FIX: convert all array fields to strings
    Object.keys(req.body).forEach((key) => {
      if (Array.isArray(req.body[key])) {
        req.body[key] = req.body[key][0];
      }
    });

    const { name, description, category, price, currency, status, discount, metaFeatures, metaInfo, video1, video2 } = req.body;
    const files = req.files || {};

    // Your image logic (unchanged)
    const file1 = files.image1?.[0];
    let imageUrls = [
      "/product.png",
      "/product.png",
      "/product.png",
      "/product.png",
      "/product.png",
      "/product.png"
    ];

    if (file1 || files.image2 || files.image3 || files.image4 || files.image5 || files.image6) {
      imageUrls = await Promise.all([
        uploadToCloud(file1),
        uploadToCloud(files.image2?.[0]),
        uploadToCloud(files.image3?.[0]),
        uploadToCloud(files.image4?.[0]),
        uploadToCloud(files.image5?.[0]),
        uploadToCloud(files.image6?.[0]),
      ]);
      imageUrls = imageUrls.map(url => url || "/product.png");
    }

    const product = await Product.create({
      name,
      description,
      category,
      price: Number(price || 0),
      currency: currency || "PKR",
      status: status || "active",
      discount: Number(discount || 0),
      image1: imageUrls[0],
      image2: imageUrls[1],
      image3: imageUrls[2],
      image4: imageUrls[3],
      image5: imageUrls[4],
      image6: imageUrls[5],
      metaFeatures: metaFeatures || "",
      metaInfo: metaInfo || "",
      video1: video1 || "",
      video2: video2 || "",
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error("createProduct:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- GET ALL PRODUCTS ----------------
export const getProducts = async () => {
  const products = await Product.find().populate("category", "name").sort({ createdAt: -1 });

  return products.map(p => {
    const obj = p.toObject();
    return {
      ...obj,
      id: obj._id,
      categoryId: obj.category?._id || null,
      categoryName: obj.category?.name || null,
      image1: obj.image1 || "/product.png",
      image2: obj.image2 || "/product.png",
      image3: obj.image3 || "/product.png",
      image4: obj.image4 || "/product.png",
      image5: obj.image5 || "/product.png",
      image6: obj.image6 || "/product.png",
    };
  });
};

// ---------------- GET SINGLE PRODUCT ----------------
export const getProduct = async (id) => {
  const product = await Product.findById(id).populate("category", "name");
  if (!product) return null;

  return {
    ...product.toObject(),
    id: product._id,
    categoryId: product.category?._id || null,
    categoryName: product.category?.name || null,
    image1: product.image1 || "/product.png",
    image2: product.image2 || "/product.png",
    image3: product.image3 || "/product.png",
    image4: product.image4 || "/product.png",
    image5: product.image5 || "/product.png",
    image6: product.image6 || "/product.png",
  };
};

// ---------------- UPDATE PRODUCT ----------------
export const updateProduct = async (req, res) => {
  try {
    // 🔥 FIX: convert all array fields to strings
    Object.keys(req.body).forEach((key) => {
      if (Array.isArray(req.body[key])) {
        req.body[key] = req.body[key][0];
      }
    });

    const files = req.files || {};
    const updates = { ...req.body };

    // normalize numeric fields
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.discount !== undefined) updates.discount = Number(updates.discount);

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });

    // Upload new images if provided
    for (let i = 1; i <= 6; i++) {
      const key = `image${i}`;
      const fileArr = files[key];
      if (fileArr && fileArr[0]) {
        updates[key] = await uploadToCloud(fileArr[0]);
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateProduct:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// ---------------- DELETE PRODUCT ----------------
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });

    // remove local files if any
    for (let i = 1; i <= 6; i++) {
      const key = `image${i}`;
      if (product[key] && product[key].includes("/uploads/")) {
        tryRemoveFileFromUrl(product[key]);
      }
    }

    res.json({ success: true, message: "Deleted", data: product });
  } catch (err) {
    console.error("deleteProduct:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
