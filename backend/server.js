import http from "http";
import express from "express";
import { Server } from "socket.io";
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
import companyRoutes from "./src/routes/company.routes.js";
import footerRoutes from "./src/routes/footer.routes.js";
import admintabRoutes from "./src/routes/admintab.routes.js";
import webpageRoutes from "./src/routes/webpage.routes.js";
import profilepageRoutes from "./src/routes/profilepage.routes.js";
import queryRoutes from "./src/routes/query.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
import blogRoutes from "./src/routes/blog.routes.js";

dotenv.config();

const app = express();

const startServer = async () => {
  try {
    await connectDB();

    // CORS - must be before routes
    const allowedOrigins = [
      "https://uk-candles.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://127.0.0.1:3000",
    ];

    const corsOptions = {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        if (origin.includes("localhost") || origin.includes("127.0.0.1")) return callback(null, true);
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    };
    
    app.use(cors(corsOptions));

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
    app.use("/api/company", companyRoutes);
    app.use("/api/footer", footerRoutes);
    app.use("/api/admintabs", admintabRoutes);
    app.use("/api/webpages", webpageRoutes);
    app.use("/api/profilepages", profilepageRoutes);
    app.use("/api/queries", queryRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/reviews", reviewRoutes);
    app.use("/api/blogs", blogRoutes);

    const PORT = process.env.PORT || 5000;
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: allowedOrigins,
        credentials: true,
      },
    });
    app.set("io", io);

    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
