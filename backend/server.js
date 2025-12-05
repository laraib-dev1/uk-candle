import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import orderRoutes from "./src/routes/order.routes.js";

import corsMiddleware from "./src/middleware/cors.js";

dotenv.config();
await connectDB();

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (VERY IMPORTANT — BEFORE ROUTES)
app.use(corsMiddleware);

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
