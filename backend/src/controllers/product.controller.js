// backend/src/controllers/product.controller.js
import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

const uploadsPath = path.join(process.cwd(), "uploads");

const buildImageUrl = (req, filename) => {
  if (!filename) return "";
  const base = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/${filename}`;
};

const getUploadedFilename = (file) => file && file.filename ? file.filename : null;

export const createProduct = async (req, res) => {
  try {
    const {
      name, description, category, price, currency, status, discount,
      metaFeatures, metaInfo, video1, video2
    } = req.body;

    // multer with fields gives req.files as object { image1: [file], ... }
    const files = req.files || {};

    // primary image1 is required for create (per your request)
    const file1 = files.image1 && files.image1[0];
    if (!file1) {
      return res.status(400).json({ success: false, message: "Primary image (image1) is required" });
    }

    const product = await Product.create({
      name,
      description,
      category,
      price: Number(price || 0),
      currency: currency || "PKR",
      status: status || "active",
      discount: Number(discount || 0),
      image1: file1 ? buildImageUrl(req, getUploadedFilename(file1)) : "",
      image2: files.image2 && files.image2[0] ? buildImageUrl(req, getUploadedFilename(files.image2[0])) : "",
      image3: files.image3 && files.image3[0] ? buildImageUrl(req, getUploadedFilename(files.image3[0])) : "",
      image4: files.image4 && files.image4[0] ? buildImageUrl(req, getUploadedFilename(files.image4[0])) : "",
      image5: files.image5 && files.image5[0] ? buildImageUrl(req, getUploadedFilename(files.image5[0])) : "",
      image6: files.image6 && files.image6[0] ? buildImageUrl(req, getUploadedFilename(files.image6[0])) : "",
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

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name").sort({ createdAt: -1 });
    const mapped = products.map(p => ({
      ...p.toObject(),
      id: p._id,
      categoryId: p.category?._id || null,
      categoryName: p.category?.name || null,
    }));
    res.json({ success: true, data: mapped });
  } catch (err) {
    console.error("getProducts:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ success: false, message: "Not found" });

    const mapped = {
      ...product.toObject(),
      id: product._id,
      categoryId: product.category?._id || null,
      categoryName: product.category?.name || null,
    };

    res.json({ success: true, data: mapped });
  } catch (err) {
    console.error("getProduct:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

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

export const updateProduct = async (req, res) => {
  try {
    const files = req.files || {}; // object of arrays per field
    const updates = { ...req.body };

    // normalize numeric fields
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.discount !== undefined) updates.discount = Number(updates.discount);

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });

    // If a new file uploaded for any imageN, remove previous local file and update URL
    for (let i = 1; i <= 6; i++) {
      const key = `image${i}`;
      const fileArr = files[key];
      if (fileArr && fileArr[0]) {
        // remove previous if local
        if (product[key] && typeof product[key] === "string" && product[key].includes("/uploads/")) {
          tryRemoveFileFromUrl(product[key]);
        }
        updates[key] = buildImageUrl(req, getUploadedFilename(fileArr[0]));
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateProduct:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });

    // remove any local upload files
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
