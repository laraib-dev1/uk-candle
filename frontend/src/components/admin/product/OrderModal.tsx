import React, { useState, useEffect } from "react";
import { Order } from "@/types/Order";
import { updateOrderStatus } from "@/api/order.api";
import { useToast } from "@/components/ui/toast";

interface OrderModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ order, open, onClose, onUpdate }) => {
  const { success, error } = useToast();
  const [status, setStatus] = useState(order?.status || "Pending");
  const [loading, setLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    setStatus(order?.status || "Pending");
  }, [order]);

  if (!open || !order) return null;

  const handleSave = async () => {
    if (loading) return;
    
    if (!status) {
      setStatusError("Status is required");
      return;
    }
    
    setLoading(true);
    setStatusError("");
    try {
      await updateOrderStatus(order._id, status);
      success("Order status updated successfully!");
      onUpdate(); 
      onClose();
    } catch (err) {
      console.error(err);
      error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 text-black">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 theme-heading">Order Details</h2>

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
          <select 
            value={status} 
            onChange={e => {
              setStatus(e.target.value);
              if (statusError) setStatusError("");
            }} 
            className={`border rounded p-2 w-full text-black ${statusError ? "border-red-500" : ""}`}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--theme-primary)";
              e.currentTarget.style.boxShadow = "0 0 0 2px var(--theme-primary)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Complete">Complete</option>
            <option value="Cancel">Cancel</option>
            <option value="Returned">Returned</option>
          </select>
          {statusError && <p className="text-red-500 text-xs mt-1">{statusError}</p>}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded text-black" onClick={onClose} disabled={loading}>Close</button>
          <button 
            className="px-4 py-2 text-white rounded theme-button flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
