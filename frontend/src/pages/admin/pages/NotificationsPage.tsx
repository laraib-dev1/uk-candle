import React, { useEffect, useState, useCallback } from "react";
import { Bell, ShoppingCart, XCircle, MessageSquare, Star, Inbox, CheckCheck } from "lucide-react";
import FilterTabs from "@/components/ui/FilterTabs";
import { useToast } from "@/components/ui/toast";

const PREFS_STORAGE_KEY = "adminNotificationPrefs";
export const INBOX_STORAGE_KEY = "adminNotificationInbox";

/** Unread count for sidebar badge (read from localStorage). */
export function getAdminNotificationUnreadCount(): number {
  try {
    const raw = localStorage.getItem(INBOX_STORAGE_KEY);
    if (!raw) return 0;
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return 0;
    return list.filter((n: AdminNotificationItem) => !n.read).length;
  } catch (_) {
    return 0;
  }
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (_) {}
}

export interface AdminNotificationPrefs {
  receivedOrder: boolean;
  receivedCancelOrder: boolean;
  receivedQuery: boolean;
  receivedReview: boolean;
}

export interface AdminNotificationItem {
  id: string;
  type: "order" | "cancelOrder" | "query" | "review";
  title: string;
  message: string;
  createdAt: string; // ISO
  read: boolean;
}

const defaultPrefs: AdminNotificationPrefs = {
  receivedOrder: true,
  receivedCancelOrder: true,
  receivedQuery: true,
  receivedReview: true,
};

function loadPrefs(): AdminNotificationPrefs {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultPrefs, ...parsed };
    }
  } catch (_) {}
  return { ...defaultPrefs };
}

function savePrefs(prefs: AdminNotificationPrefs) {
  localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
}

function loadInbox(): AdminNotificationItem[] {
  try {
    const raw = localStorage.getItem(INBOX_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (_) {}
  return [];
}

function saveInbox(items: AdminNotificationItem[]) {
  localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(items));
}

/** Call this from order/query/review flows to add a notification (respects preferences). */
export function addAdminNotification(payload: {
  type: AdminNotificationItem["type"];
  title: string;
  message: string;
}) {
  const prefs = loadPrefs();
  const key: keyof AdminNotificationPrefs =
    payload.type === "order"
      ? "receivedOrder"
      : payload.type === "cancelOrder"
        ? "receivedCancelOrder"
        : payload.type === "query"
          ? "receivedQuery"
          : "receivedReview";
  if (!prefs[key]) return;

  const item: AdminNotificationItem = {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const inbox = loadInbox();
  saveInbox([item, ...inbox]);
  playNotificationSound();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("adminNotificationUpdated"));
  }
}

const typeConfig: Record<
  AdminNotificationItem["type"],
  { label: string; icon: React.ElementType }
> = {
  order: { label: "Order", icon: ShoppingCart },
  cancelOrder: { label: "Cancel Order", icon: XCircle },
  query: { label: "Query", icon: MessageSquare },
  review: { label: "Review", icon: Star },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<"preferences" | "inbox">("preferences");
  const [prefs, setPrefs] = useState<AdminNotificationPrefs>(loadPrefs);
  const [inbox, setInbox] = useState<AdminNotificationItem[]>(loadInbox);

  const refreshInbox = useCallback(() => setInbox(loadInbox()), []);

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  useEffect(() => {
    if (activeTab === "inbox") refreshInbox();
  }, [activeTab, refreshInbox]);

  const updatePref = (key: keyof AdminNotificationPrefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    savePrefs(next);
    success("Notification preference saved.");
  };

  const markAsRead = (id: string) => {
    const list = loadInbox();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveInbox(updated);
    setInbox(updated);
    window.dispatchEvent(new CustomEvent("adminNotificationUpdated"));
    success("Marked as read.");
  };

  const markAllAsRead = () => {
    const list = loadInbox();
    const updated = list.map((n) => ({ ...n, read: true }));
    saveInbox(updated);
    setInbox(updated);
    window.dispatchEvent(new CustomEvent("adminNotificationUpdated"));
    success("All marked as read.");
  };

  const options: { key: keyof AdminNotificationPrefs; label: string; icon: React.ElementType }[] = [
    { key: "receivedOrder", label: "Received Order", icon: ShoppingCart },
    { key: "receivedCancelOrder", label: "Received Cancel Order", icon: XCircle },
    { key: "receivedQuery", label: "Received Query", icon: MessageSquare },
    { key: "receivedReview", label: "Received Review", icon: Star },
  ];

  const unreadCount = inbox.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 theme-heading">
            <Bell className="w-7 h-7" style={{ color: "var(--theme-primary)" }} />
            Notifications
          </h1>
          <p className="text-gray-600 mt-1">
            Manage preferences and read your notifications.
          </p>
        </div>
        <FilterTabs
          tabs={[
            { id: "preferences", label: "Preferences" },
            { id: "inbox", label: unreadCount > 0 ? `Inbox (${unreadCount})` : "Inbox" },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as "preferences" | "inbox")}
        />
      </div>

      {/* Tab content */}
      {activeTab === "preferences" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Notification preferences</h2>
          </div>
          <div className="p-6 space-y-4">
            {options.map(({ key, label, icon: Icon }) => (
              <div
                key={key}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "var(--theme-light, #f5f5f5)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--theme-primary)" }} />
                  </div>
                  <span className="font-medium text-gray-900">{label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs[key]}
                    onChange={(e) => updatePref(key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--theme-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--theme-primary)]" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "inbox" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Your notifications</h2>
            {inbox.length > 0 && unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                style={{ color: "var(--theme-primary)" }}
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
          <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
            {inbox.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No notifications yet</p>
                <p className="text-sm mt-1">When you receive orders, queries, or reviews, they will appear here.</p>
              </div>
            ) : (
              inbox.map((n) => {
                const config = typeConfig[n.type];
                const Icon = config.icon;
                return (
                  <div
                    key={n.id}
                    className={`px-6 py-4 flex gap-4 ${n.read ? "bg-white" : "bg-gray-50/80"}`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--theme-light, #f5f5f5)" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "var(--theme-primary)" }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-medium ${n.read ? "text-gray-700" : "text-gray-900"}`}>
                          {n.title}
                        </p>
                        <span className="text-xs text-gray-500 shrink-0">{formatDate(n.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(n.id)}
                          className="text-xs font-medium mt-2"
                          style={{ color: "var(--theme-primary)" }}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
