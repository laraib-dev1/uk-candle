import connectDB from "../../src/config/db.js";
import { getCategory, updateCategory, deleteCategory } from "../../src/controllers/category.controller.js";
import Cors from "micro-cors";

const cors = Cors({
  allowMethods: ["GET","PUT","DELETE","OPTIONS"],
  origin: process.env.FRONTEND_URL,
});

export default cors(async function handler(req, res) {
  // 1️⃣ Preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.status(200).end(); 
  }

  // 2️⃣ Connect DB
  await connectDB();
  const { id } = req.query;

  try {
    if (req.method === "GET") return getCategory({ ...req, params: { id } }, res);
    if (req.method === "PUT") return updateCategory({ ...req, params: { id } }, res);
    if (req.method === "DELETE") return deleteCategory({ ...req, params: { id } }, res);

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Category handler error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});
