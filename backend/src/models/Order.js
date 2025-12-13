import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  phoneNumber: { type: String, required: true },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  type: { type: String, default: "Online" },
  bill: { type: Number, required: true },
  payment: { type: String, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
