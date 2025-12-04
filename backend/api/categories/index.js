import connectDB from "../../src/config/db.js";
import { addCategory, getCategories } from "../../src/controllers/category.controller.js";
import Cors from "micro-cors";

const cors = Cors({ allowMethods: ["GET","POST","OPTIONS"], origin: process.env.FRONTEND_URL });

export default cors(async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.status(200).end(); 
  }

  await connectDB();

  try {
    if (req.method === "GET") return getCategories(req, res);
    if (req.method === "POST") return addCategory(req, res);

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Categories handler error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});
