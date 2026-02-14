import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { addAdminNotification } from "@/pages/admin/pages/NotificationsPage";
import { markOrderSeen, markReviewSeen, markQuerySeen } from "@/utils/adminNotifications";

function getSocketUrl(): string {
  const urls = (import.meta.env.VITE_API_URLS || "").split(",").map((u: string) => u.trim()).filter(Boolean);
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const apiUrl = (isLocalhost ? urls[0] : urls[1]) || urls[0] || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "") || "http://localhost:5000";
}

/**
 * Connects to the backend Socket.io server and listens for real-time admin notifications.
 * Call this when the admin is logged in (e.g. inside AdminLayout).
 */
export function useAdminSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = getSocketUrl();
    const socket = io(url, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("admin:newOrder", (data: { orderId?: string; title: string; message: string }) => {
      addAdminNotification({ type: "order", title: data.title, message: data.message });
      if (data.orderId) markOrderSeen(data.orderId, "Pending");
    });
    socket.on("admin:orderCancelled", (data: { orderId?: string; title: string; message: string }) => {
      addAdminNotification({ type: "cancelOrder", title: data.title, message: data.message });
      if (data.orderId) markOrderSeen(data.orderId, "cancelled");
    });
    socket.on("admin:newReview", (data: { reviewId?: string; title: string; message: string }) => {
      addAdminNotification({ type: "review", title: data.title, message: data.message });
      if (data.reviewId) markReviewSeen(data.reviewId);
    });
    socket.on("admin:newQuery", (data: { queryId?: string; title: string; message: string }) => {
      addAdminNotification({ type: "query", title: data.title, message: data.message });
      if (data.queryId) markQuerySeen(data.queryId);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);
}
