import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Order } from "@/types/Order";
import { updateOrderStatus, getOrderById } from "@/api/order.api";
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
  const [currentOrder, setCurrentOrder] = useState<Order | null>(order);
  const [loading, setLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [fetchingOrder, setFetchingOrder] = useState(false);

  // Fetch fresh order data when modal opens
  useEffect(() => {
    if (open && order?._id) {
      setFetchingOrder(true);
      getOrderById(order._id)
        .then((freshOrder) => {
          setCurrentOrder(freshOrder);
          setStatus(freshOrder.status || "Pending");
        })
        .catch((err) => {
          console.error("Failed to fetch fresh order data:", err);
          // Fallback to prop order if fetch fails
          setCurrentOrder(order);
          setStatus(order?.status || "Pending");
        })
        .finally(() => {
          setFetchingOrder(false);
        });
    } else if (order) {
      setCurrentOrder(order);
      setStatus(order.status || "Pending");
    }
  }, [open, order?._id]); // Re-fetch when modal opens or order ID changes

  if (!open || !currentOrder) return null;

  const handleSave = async () => {
    if (loading) return;
    
    if (!status) {
      setStatusError("Status is required");
      return;
    }
    
    setLoading(true);
    setStatusError("");
    try {
      await updateOrderStatus(currentOrder._id, status);
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
    <div className="fixed inset-0 z-50 flex justify-center items-center text-black">
      <div className="absolute inset-0 bg-black/70" aria-hidden />
      <div className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col mx-4">
        <header
          className="admin-modal-header flex items-center justify-between text-left w-full shrink-0 px-6"
          style={{ height: "72px", boxSizing: "border-box" }}
        >
          <h2 className="text-xl font-bold text-white">Order Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="p-6 flex-1 overflow-y-auto">
        {fetchingOrder ? (
          <div className="text-center py-4">
            <p className="text-gray-900">Loading order details...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-900"><strong>Customer:</strong> {currentOrder.customerName}</p>
            <p className="text-gray-900"><strong>Phone:</strong> {currentOrder.phoneNumber}</p>
            <p className="text-gray-900">
              <strong>Address:</strong>{" "}
              {currentOrder.address
                ? `${currentOrder.address.line1 || ""}${currentOrder.address.area ? ", " + currentOrder.address.area : ""}, ${currentOrder.address.city || ""}, ${currentOrder.address.province || ""}, ${currentOrder.address.postalCode || ""}`
                : "No address provided"}
            </p>
            <p className="text-gray-900"><strong>Items:</strong> {currentOrder.items.map(i => `${i.name} x ${i.quantity}`).join(", ")}</p>
            <p className="text-gray-900"><strong>Bill:</strong> ${currentOrder.bill}</p>
            <p className="text-gray-900"><strong>Payment:</strong> {currentOrder.payment}</p>
            <p className="text-gray-900"><strong>Order Date:</strong> {new Date(currentOrder.createdAt).toLocaleString()}</p>
            
            {/* Show cancellation info if order was cancelled */}
            {(() => {
              const isCancelled = currentOrder.status === "Cancelled" || 
                                  currentOrder.status === "Cancel" || 
                                  currentOrder.status?.toLowerCase() === "cancelled" || 
                                  currentOrder.status?.toLowerCase() === "cancel";
              
              if (isCancelled) {
                const cancelledBy = (currentOrder as any).cancelledBy;
                const cancelledAt = (currentOrder as any).cancelledAt;
                const userId = (currentOrder as any).userId;
                
                // If cancelledBy is not set but order has userId, it was likely cancelled by user
                // (since only users can cancel through frontend, admin cancels through admin panel)
                const whoCancelled = cancelledBy 
                  ? (cancelledBy === "user" ? "Customer" : "Admin")
                  : (userId ? "Customer" : "Unknown");
                
                return (
                  <div className="mt-3 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 text-lg">⚠️</span>
                      <div>
                        <p className="text-sm font-semibold text-red-900">
                          Cancelled by: <span className="font-bold">{whoCancelled}</span>
                        </p>
                        {cancelledAt && (
                          <p className="text-xs text-red-700 mt-1">
                            Cancelled on: {new Date(cancelledAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </>
        )}

        <div className="mt-4">
          <label className="block mb-1 text-gray-900">Status:</label>
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
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>
          {statusError && <p className="text-red-500 text-xs mt-1">{statusError}</p>}
        </div>
        </div>

        <footer
          className="admin-modal-footer flex justify-end items-center gap-4 shrink-0 w-full px-6"
          style={{ height: "72px", boxSizing: "border-box" }}
        >
          <button className="px-4 h-9 bg-white text-[var(--theme-primary)] rounded font-medium hover:bg-gray-100 text-sm" onClick={onClose} disabled={loading}>Close</button>
          <button 
            className="px-4 h-9 bg-white text-[var(--theme-primary)] rounded font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-gray-100 text-sm" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading && <span className="animate-spin h-4 w-4 border-2 border-[var(--theme-primary)] border-t-transparent rounded-full" />}
            Save
          </button>
        </footer>
      </div>
    </div>
  );
};
