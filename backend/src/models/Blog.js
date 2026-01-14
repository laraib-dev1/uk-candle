import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subTitle: { type: String, default: "" },
    description: { type: String, required: true }, // Rich text HTML content
    category: { type: mongoose.Schema.Types.ObjectId, ref: "BlogCategory", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "BlogAuthor", required: true },
    tags: [{ type: String, trim: true }], // Array of tag strings
    image: { type: String, default: "" }, // Main blog image
    status: { type: String, enum: ["published", "unpublished", "draft"], default: "draft" },
    views: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for better query performance
blogSchema.index({ category: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ createdAt: -1 });

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
