import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import cors from "cors";

import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import bannerRoutes from "./src/routes/banner.routes.js";
import contentRoutes from "./src/routes/content.routes.js";

dotenv.config();

const app = express();

const startServer = async () => {
  try {
    await connectDB();

    // CORS
    app.use(
      cors({
        origin: [
          "https://uk-candles.vercel.app",
          "http://localhost:3000",
          "http://localhost:5173",
        ],
        credentials: true,
      })
    );

    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/payment", paymentRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/banners", bannerRoutes);
    app.use("/api/content", contentRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
