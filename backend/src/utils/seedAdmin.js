// src/utils/seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
// Load .env.local first so it wins; then .env (no override)
dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config({ path: path.join(root, ".env") });

const uri = process.env.MONGO_URI_LOCAL || process.env.MONGO_URI;

async function seedAdmin() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");

    let adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    let adminPassword = process.env.ADMIN_PASSWORD || "11223344";
    if (adminEmail === "admin@shop.com") {
      adminEmail = "admin@gmail.com";
      adminPassword = "11223344";
    }
    console.log("Creating/updating admin for:", adminEmail);

    const existingAdmin = await User.findOne({ email: adminEmail });
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      existingAdmin.name = existingAdmin.name || "Admin";
      await existingAdmin.save();
      console.log("Admin updated successfully for:", adminEmail);
      process.exit(0);
      return;
    }

    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully for:", adminEmail);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin", err);
    process.exit(1);
  }
}

seedAdmin();
