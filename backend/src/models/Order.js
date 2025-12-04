import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  items: Array,
  amount: Number,
  address: Object,
  paymentStatus: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
