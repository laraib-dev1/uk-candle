import connectDB from "../config/db.js";

export const withDB = (handler) => async (req, res) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || "*";

  // Set CORS headers for all requests
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    await connectDB(); // connect to DB
    return handler(req, res); // call the actual handler
  } catch (err) {
    console.error("Middleware Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
