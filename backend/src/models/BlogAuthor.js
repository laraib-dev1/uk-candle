import mongoose from "mongoose";

const blogAuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    avatar: { type: String },
    bio: { type: String },
    socialLinks: {
      facebook: { type: String },
      tiktok: { type: String },
      instagram: { type: String },
      youtube: { type: String },
      linkedin: { type: String },
      other: { type: String },
    },
    blogs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.BlogAuthor || mongoose.model("BlogAuthor", blogAuthorSchema);
