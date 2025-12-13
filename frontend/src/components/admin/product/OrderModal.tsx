import React, { useState, useEffect } from "react";
import { Order } from "@/types/Order";
import { updateOrderStatus } from "@/api/order.api";

interface OrderModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ order, open, onClose, onUpdate }) => {
  const [status, setStatus] = useState(order?.status || "Pending");

  useEffect(() => {
    setStatus(order?.status || "Pending");
  }, [order]);

  if (!open || !order) return null;

  const handleSave = async () => {
    try {
      await updateOrderStatus(order._id, status);
      onUpdate(); 
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 text-black">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>

        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Phone:</strong> {order.phoneNumber}</p>
<p>
  <strong>Address:</strong>{" "}
  {order.address
    ? `${order.address.line1 || ""}${order.address.area ? ", " + order.address.area : ""}, ${order.address.city || ""}, ${order.address.province || ""}, ${order.address.postalCode || ""}`
    : "No address provided"}
</p>
        <p><strong>Items:</strong> {order.items.map(i => `${i.name} x ${i.quantity}`).join(", ")}</p>
        <p><strong>Bill:</strong> ${order.bill}</p>
        <p><strong>Payment:</strong> {order.payment}</p>

        <div className="mt-4">
          <label className="block mb-1">Status:</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded p-2 w-full">
            <option value="Pending">Pending</option>
            <option value="Complete">Complete</option>
            <option value="Cancel">Cancel</option>
            <option value="Returned">Returned</option>
          </select>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
          <button className="px-4 py-2 bg-[#C69C6D] hover:bg-[#b88b5f] text-white rounded" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};
