// backend/src/controllers/product.controller.js
import Product from "../models/Product.js";
import "../models/Category.js";
import fs from "fs";
import path from "path";
import cloudinary from "cloudinary";
import connectDB from "../config/db.js";

// Configure Cloudinary
cloudinary.v2.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload helper
// const uploadToCloud = async (file) => {
//   if (!file) return "";

//   const filepath = file.filepath || file.path;  // support both local & Vercel

//   const result = await cloudinary.v2.uploader.upload(filepath);
// try { fs.unlinkSync(filepath); } catch(e){}
//   return result.secure_url;
// };
const uploadToCloud = async (file) => {
  if (!file) return "";

  // Vercel (no filepath → use buffer)
  if (file.buffer) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: "products" },
        (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }
      );
      stream.end(file.buffer);
    });
  }

  // LOCAL (file.path exists)
  if (file.path) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    try { fs.unlinkSync(file.path); } catch (e) {}
    return result.secure_url;
  }

  return "";
};

const uploadsPath = path.join(process.cwd(), "uploads");
export const tryRemoveFileFromUrl = (url) => {
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
export const createProduct = async (req) => {
  await connectDB(); // ensure DB connection for serverless
  Object.keys(req.body).forEach(key => {
    if (Array.isArray(req.body[key])) req.body[key] = req.body[key][0];
  });

  const { name, description, category, price, currency, status, discount, metaFeatures, metaInfo, video1, video2, enableImages, enableDiscount, enableMetaFeatures, enableMetaInfo, enableVideos } = req.body;
  const files = req.files || {};

  let imageUrls = ["/product.png", "/product.png", "/product.png", "/product.png", "/product.png", "/product.png"];

  if (files.image1 || files.image2 || files.image3 || files.image4 || files.image5 || files.image6) {
    imageUrls = await Promise.all([
      uploadToCloud(files.image1?.[0]),
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
    enableImages: enableImages !== undefined ? enableImages : true,
    enableDiscount: enableDiscount !== undefined ? enableDiscount : true,
    enableMetaFeatures: enableMetaFeatures !== undefined ? enableMetaFeatures : true,
    enableMetaInfo: enableMetaInfo !== undefined ? enableMetaInfo : true,
    enableVideos: enableVideos !== undefined ? enableVideos : true,
  });

  return product;
};

// ---------------- UPDATE PRODUCT ----------------
export const updateProduct = async (req) => {
  await connectDB();
  Object.keys(req.body).forEach(key => {
    if (Array.isArray(req.body[key])) req.body[key] = req.body[key][0];
  });

  const files = req.files || {};
  const updates = { ...req.body };

  if (updates.price !== undefined) updates.price = Number(updates.price);
  if (updates.discount !== undefined) updates.discount = Number(updates.discount);

  const product = await Product.findById(req.params.id);
  if (!product) throw new Error("Product not found");

  for (let i = 1; i <= 6; i++) {
    const key = `image${i}`;
    const fileArr = files[key];
    if (fileArr && fileArr[0]) updates[key] = await uploadToCloud(fileArr[0]);
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
  return updated;
};

// ---------------- GET ALL PRODUCTS ----------------
export const getProducts = async () => {
  await connectDB();
  const products = await Product.find().populate("category", "name").sort({ createdAt: -1 });
  return products.map(p => ({
    ...p.toObject(),
    id: p._id,
    categoryId: p.category?._id || null,
    categoryName: p.category?.name || null,
    image1: p.image1 || "/product.png",
    image2: p.image2 || "/product.png",
    image3: p.image3 || "/product.png",
    image4: p.image4 || "/product.png",
    image5: p.image5 || "/product.png",
    image6: p.image6 || "/product.png",
  }));
};


// ---------------- GET SINGLE PRODUCT ---------------- 
export const getProduct = async (req) => {
  await connectDB();
  const { id } = req.params;
  const product = await Product.findById(id).populate("category", "name");
  if (!product) throw new Error("Product not found");
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

// ---------------- GET PRODUCT OG META TAGS (for social media crawlers) ---------------- 
export const getProductOGTags = async (req, res) => {
  try {
    await connectDB();
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Get company name (you might want to fetch this from database)
    const companyName = process.env.COMPANY_NAME || "Grace By Anu";
    const baseUrl = process.env.FRONTEND_URL || req.protocol + "://" + req.get("host");
    
    // Get product image URL (absolute)
    const getAbsoluteImageUrl = (imageUrl) => {
      if (!imageUrl || imageUrl === "/product.png" || imageUrl.trim() === "") {
        return `${baseUrl}/product.png`;
      }
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
      }
      const apiUrl = process.env.API_URL?.replace("/api", "") || baseUrl;
      return imageUrl.startsWith("/") ? `${apiUrl}${imageUrl}` : `${apiUrl}/${imageUrl}`;
    };

    // Clean description (remove HTML tags)
    const cleanDescription = (desc) => {
      if (!desc) return `${product.name} - Available at ${companyName}`;
      // Simple HTML tag removal
      let text = desc.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
      if (text.length > 200) {
        text = text.substring(0, 197) + "...";
      }
      return text || `${product.name} - Available at ${companyName}`;
    };

    const ogImageUrl = getAbsoluteImageUrl(product.image1);
    const ogDescription = cleanDescription(product.description);
    const productUrl = `${baseUrl}/product/${product._id}`;
    const pageTitle = `${product.name} | ${companyName}`;

    // Escape HTML entities
    const escapeHtml = (text) => {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Return HTML with OG tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(ogDescription)}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${productUrl}">
  <meta property="og:title" content="${escapeHtml(product.name)}">
  <meta property="og:description" content="${escapeHtml(ogDescription)}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:secure_url" content="${ogImageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(product.name)}">
  <meta property="og:site_name" content="${escapeHtml(companyName)}">
  <meta property="product:price:amount" content="${product.price}">
  <meta property="product:price:currency" content="${product.currency || 'PKR'}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${productUrl}">
  <meta name="twitter:title" content="${escapeHtml(product.name)}">
  <meta name="twitter:description" content="${escapeHtml(ogDescription)}">
  <meta name="twitter:image" content="${ogImageUrl}">
  <meta name="twitter:image:alt" content="${escapeHtml(product.name)}">
  
  <!-- Redirect to actual product page -->
  <meta http-equiv="refresh" content="0;url=${productUrl}">
  <script>window.location.href = "${productUrl}";</script>
</head>
<body>
  <p>Redirecting to <a href="${productUrl}">${escapeHtml(product.name)}</a>...</p>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error("Error generating OG tags:", error);
    res.status(500).send("Error generating meta tags");
  }
};


// ---------------- DELETE PRODUCT ----------------
export const deleteProduct = async (req) => {
  await connectDB();
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new Error("Product not found");

  for (let i = 1; i <= 6; i++) {
    const key = `image${i}`;
    if (product[key] && product[key].includes("/uploads/")) tryRemoveFileFromUrl(product[key]);
  }
  return product;
};

export const withHandler = (handler) => async (req, res) => {
  try {
    const data = await handler(req, res);
    if (!res.headersSent) {
      res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URLS.split(",").includes(req.headers.origin) ? req.headers.origin : "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      if (req.method === "OPTIONS") return res.status(200).end();
      res.status(200).json({ success: true, data });
    }
    return data;
  } catch (err) {
    console.error("Handler Error:", err);
    if (!res.headersSent) res.status(500).json({ success: false, message: err.message });
    throw err;
  }
};