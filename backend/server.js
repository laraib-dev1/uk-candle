import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
dotenv.config();
await connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect to DB
const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydb";
mongoose.connect(MONGO).then(() => console.log("Mongo connected")).catch(console.error);

app.use("/api/auth", authRoutes);
// app.use("/api", protectedRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
