import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  company: { type: String, default: "" },
  slogan: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  supportEmail: { type: String, default: "" },
  address: { type: String, default: "" },
  logo: { type: String, default: "" },
  favicon: { type: String, default: "" },
  socialLinks: {
    facebook: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    other: { type: String, default: "" },
  },
  socialPosts: [{
    image: { type: String, default: "" },
    url: { type: String, default: "" },
    order: { type: Number, default: 0 },
  }],
  brandTheme: {
    primary: { type: String, default: "#8C5934" },
    accent: { type: String, default: "" },
    dark: { type: String, default: "" },
    light: { type: String, default: "" },
  },
  copyright: { type: String, default: "" },
  description: { type: String, default: "" },
  // Default currency for products (set in Developer > Company; used in admin product modal)
  currency: { type: String, default: "PKR" },
  // Checkout settings (admin Assets > Checkout tab)
  checkout: {
    codEnabled: { type: Boolean, default: true },
    onlinePaymentEnabled: { type: Boolean, default: true },
    taxEnabled: { type: Boolean, default: false },
    taxRate: { type: Number, default: 0 }, // e.g. 10 = 10%
    shippingEnabled: { type: Boolean, default: false },
    shippingCharges: { type: Number, default: 0 },
  },
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);
















