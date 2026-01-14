import mongoose from "mongoose";

const blogAuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    blogs: { type: Number, default: 0 }, // Count of blogs by this author
  },
  { timestamps: true }
);

export default mongoose.models.BlogAuthor || mongoose.model("BlogAuthor", blogAuthorSchema);
