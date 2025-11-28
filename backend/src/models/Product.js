// backend/src/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false },
  price: { type: Number, default: 0 },
  currency: { type: String, default: "PKR" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  discount: { type: Number, default: 0 },

  // fixed image fields (option B)
  image1: { type: String, default: "" }, // primary - required at create (validated in controller)
  image2: { type: String, default: "" },
  image3: { type: String, default: "" },
  image4: { type: String, default: "" },
  image5: { type: String, default: "" },
  image6: { type: String, default: "" },

  // meta & videos
  metaFeatures: { type: String, default: "" },
  metaInfo: { type: String, default: "" },
  video1: { type: String, default: "" },
  video2: { type: String, default: "" },

}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
