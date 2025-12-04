// backend/api/order/[route].js
import connectDB from "../../src/config/db.js";
import Order from "../../src/models/Order.js";
import Cors from "micro-cors";

const cors = Cors({ allowMethods: ["GET","POST","OPTIONS"], origin: process.env.FRONTEND_URL });

export default cors(async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end(); // preflight

  await connectDB();

  const route = req.query.route; // /api/order/create => route = "create"

  try {
    // Create order
    if (req.method === "POST" && route === "create") {
      const order = await Order.create(req.body);
      return res.status(201).json({ success: true, data: order });
    }

    // Add other order routes if needed (GET, DELETE, etc.)

    return res.status(404).json({ success: false, message: "Route not found" });
  } catch (err) {
    console.error("Order handler error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});
