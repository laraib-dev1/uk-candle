import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB  from "./src/config/db.js";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import paymentRoutes from './src/routes/payment.routes.js';
import orderRoutes from "./src/routes/order.routes.js";
dotenv.config();
await connectDB();

const app = express();
const allowedOrigins = process.env.FRONTEND_URLS.split(",");

// ✅ Simple and robust CORS setup
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle preflight requests
app.options("/", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


// app.options("/*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
// app.use("/api", protectedRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/orders", orderRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
