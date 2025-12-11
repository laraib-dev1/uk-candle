import express from "express";
import { protect, isAdmin } from "../middleware/auth.js";
import { getOrders, createOrder } from "../controllers/order.controller.js";

const router = express.Router();

// Fetch all orders (admin only)
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const orders = await getOrders(req);
    res.json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create order
router.post("/create", protect, async (req, res) => {
  try {
    const order = await createOrder(req);
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
