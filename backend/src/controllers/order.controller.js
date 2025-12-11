import Order from "../models/Order.js";

// Fetch all orders
export const getOrders = async (req) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  return orders;
};

// Fetch single order (optional)
export const getOrderById = async (req) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new Error("Order not found");
  return order;
};

// Create order
export const createOrder = async (req) => {
  const order = await Order.create(req.body);
  return order;
};
