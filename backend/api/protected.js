// backend/api/protected/[...route].js

import connectDB from "../../src/config/db.js";
import { protect, isAdmin } from "../../src/middleware/auth.js";
import Cors from "micro-cors";

// ----------------------------
// Initialize CORS
// ----------------------------
const cors = Cors({
  allowMethods: ["GET", "OPTIONS"],
  origin: process.env.FRONTEND_URL,
});

// ----------------------------
// Serverless handler
// ----------------------------
export default cors(async function handler(req, res) {
  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") return res.status(200).end();

    // Connect to MongoDB
    await connectDB();

    // Get dynamic route segments
    const route = req.query.route; // e.g., ["user","profile"] or ["admin","dashboard"]

    if (!route || route.length < 2) {
      return res.status(404).json({ message: "Route not found" });
    }

    // ---------------------------
    // GET /api/protected/user/profile
    // ---------------------------
    if (req.method === "GET" && route[0] === "user" && route[1] === "profile") {
      await protect(req, res); // authenticate user
      return res.status(200).json({
        message: "This is user profile data",
        user: req.user,
      });
    }

    // ---------------------------
    // GET /api/protected/admin/dashboard
    // ---------------------------
    if (req.method === "GET" && route[0] === "admin" && route[1] === "dashboard") {
      await protect(req, res); // authenticate user
      await isAdmin(req, res);  // ensure admin
      return res.status(200).json({
        message: "Welcome to admin dashboard",
        admin: req.user,
      });
    }

    // ---------------------------
    // Route Not Found
    // ---------------------------
    return res.status(404).json({ message: "Route not found" });

  } catch (error) {
    console.error("Protected handler error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
