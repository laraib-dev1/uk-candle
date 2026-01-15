import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    blogs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.BlogCategory || mongoose.model("BlogCategory", blogCategorySchema);
