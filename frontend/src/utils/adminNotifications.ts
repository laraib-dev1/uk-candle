/**
 * When admin fetches orders, reviews, or queries, we diff with last known state
 * and push notifications for new/cancelled orders, new reviews, new queries.
 */
import { addAdminNotification } from "@/pages/admin/pages/NotificationsPage";

const ORDERS_STATE_KEY = "adminNotificationOrdersState";
const REVIEWS_STATE_KEY = "adminNotificationReviewsState";
const QUERIES_STATE_KEY = "adminNotificationQueriesState";

interface OrderLike {
  _id: string;
  id?: string;
  status: string;
  customerName?: string;
  createdAt?: string;
}

interface ReviewLike {
  _id: string;
  productName?: string;
  comment?: string;
  createdAt?: string;
}

interface QueryLike {
  _id?: string;
  id?: string;
  name?: string;
  message?: string;
  createdAt?: string;
}

const RECENT_MS = 24 * 60 * 60 * 1000; // 24 hours – treat as "new" on first load

function isRecent(item: { createdAt?: string | Date }): boolean {
  if (!item?.createdAt) return false;
  const t = typeof item.createdAt === "string" ? new Date(item.createdAt).getTime() : (item.createdAt as Date).getTime();
  return Date.now() - t <= RECENT_MS;
}

function getOrderId(o: OrderLike): string {
  return o._id || (o as any).id || "";
}

function getReviewId(r: ReviewLike): string {
  return r._id || "";
}

function getQueryId(q: QueryLike): string {
  return (q._id || (q as any).id || "") as string;
}

export function processOrdersForNotifications(orders: OrderLike[]): void {
  try {
    const raw = localStorage.getItem(ORDERS_STATE_KEY);
    const last: Record<string, string> = raw ? JSON.parse(raw) : {};
    const current: Record<string, string> = {};
    const hasSeenBefore = Object.keys(last).length > 0;

    for (const o of orders) {
      const id = getOrderId(o);
      if (!id) continue;
      const status = (o.status || "").toLowerCase();
      current[id] = status;

      const prevStatus = last[id];
      if (prevStatus === undefined && hasSeenBefore) {
        addAdminNotification({
          type: "order",
          title: "New order received",
          message: `Order from ${o.customerName || "Customer"}`,
        });
      } else if (prevStatus !== "cancelled" && status === "cancelled") {
        addAdminNotification({
          type: "cancelOrder",
          title: "Order cancelled",
          message: `Order ${id} was cancelled.`,
        });
      }
    }

    localStorage.setItem(ORDERS_STATE_KEY, JSON.stringify(current));
  } catch (_) {}
}

export function processReviewsForNotifications(reviews: ReviewLike[]): void {
  try {
    const raw = localStorage.getItem(REVIEWS_STATE_KEY);
    const lastIds: Record<string, true> = raw ? JSON.parse(raw) : {};
    const currentIds: Record<string, true> = {};
    const hasSeenBefore = Object.keys(lastIds).length > 0;

    for (const r of reviews) {
      const id = String(getReviewId(r));
      if (!id) continue;
      currentIds[id] = true;
      if (!lastIds[id] && (hasSeenBefore || isRecent(r))) {
        addAdminNotification({
          type: "review",
          title: "New review received",
          message: (r.productName ? `Review for ${r.productName}. ` : "") + (r.comment ? r.comment.slice(0, 80) + (r.comment.length > 80 ? "…" : "") : ""),
        });
      }
    }

    localStorage.setItem(REVIEWS_STATE_KEY, JSON.stringify(currentIds));
  } catch (_) {}
}

export function processQueriesForNotifications(queries: QueryLike[]): void {
  try {
    const raw = localStorage.getItem(QUERIES_STATE_KEY);
    const lastIds: Record<string, true> = raw ? JSON.parse(raw) : {};
    const currentIds: Record<string, true> = {};
    const hasSeenBefore = Object.keys(lastIds).length > 0;

    for (const q of queries) {
      const id = String(getQueryId(q));
      if (!id) continue;
      currentIds[id] = true;
      if (!lastIds[id] && (hasSeenBefore || isRecent(q))) {
        const subj = (q as any).subject || (q as any).name || "";
        const desc = (q as any).description || (q as any).message || "";
        addAdminNotification({
          type: "query",
          title: "New query received",
          message: (subj ? `${subj}: ` : "") + (desc ? String(desc).slice(0, 80) + (String(desc).length > 80 ? "…" : "") : ""),
        });
      }
    }

    localStorage.setItem(QUERIES_STATE_KEY, JSON.stringify(currentIds));
  } catch (_) {}
}
