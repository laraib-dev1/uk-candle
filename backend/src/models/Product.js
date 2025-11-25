import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String },
    image: { type: String },
    status: { type: String, enum: ["active", "disable"], default: "active" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
