import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../config/db.js";
import cloudinary from "cloudinary";
import fs from "fs";

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload helper for serverless
const uploadToCloud = async (file) => {
  if (!file) return "";

  const filepath = file.filepath || file.path; // Local + Vercel support

  const result = await cloudinary.v2.uploader.upload(filepath);
  try { fs.unlinkSync(filepath); } catch (e) {}

  return result.secure_url;
};

// JWT helper
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* ----------------------------- REGISTER ----------------------------- */
export const registerUser = async (req) => {
  await connectDB();
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new Error("All fields are required");

  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "user",
  });

  const token = signToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/* ----------------------------- LOGIN ----------------------------- */
export const loginUser = async (req) => {
  await connectDB();
  const { email, password } = req.body;

  if (!email || !password)
    throw new Error("Email and password required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = signToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/* ----------------------------- ADMIN LOGIN ----------------------------- */
export const adminLoginUser = async (req) => {
  await connectDB();
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  if (user.role !== "admin") throw new Error("Not an admin");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = signToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/* ----------------------------- GET PROFILE ----------------------------- */
export const getMe = async (req) => {
  await connectDB();
  const user = await User.findById(req.user.id).select("-password");
  if (!user) throw new Error("User not found");

  return { user };
};

/* ----------------------------- UPDATE PROFILE ----------------------------- */
export const updateProfileUser = async (req) => {
  await connectDB();
  const { name, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true }
  ).select("-password");

  return { user };
};

/* ----------------------------- CHANGE PASSWORD ----------------------------- */
export const changePasswordUser = async (req) => {
  await connectDB();
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) throw new Error("Old password incorrect");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: "Password updated" };
};

/* ----------------------------- UPDATE AVATAR ----------------------------- */
export const updateAvatarUser = async (req) => {
  await connectDB();

  const file = req.files?.avatar?.[0];
  if (!file) throw new Error("No file uploaded");

  const avatarUrl = await uploadToCloud(file);

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: avatarUrl },
    { new: true }
  ).select("-password");

  return { avatar: avatarUrl };
};
