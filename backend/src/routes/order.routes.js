import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.send(order);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
