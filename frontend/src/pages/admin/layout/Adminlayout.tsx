import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth"; // adjust path
import PageLoader from "@/components/ui/PageLoader";
import { getAdminNotificationUnreadCount } from "@/pages/admin/pages/NotificationsPage";
import { useAdminSocket } from "@/hooks/useAdminSocket";

import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  ImageIcon,
  Bell,
  Settings,
  LogOut,
  Cog,
  Menu,
  MessageSquare,
  FileText,
  FolderTree,
  Star,
  BarChart3,
} from "lucide-react";
import { getMe } from "@/api/auth.api"; // make sure path is correct
import { getEnabledAdminTabs } from "@/api/admintab.api";
import * as LucideIcons from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
}

function putNotificationsAboveSettings(items: MenuItem[]): MenuItem[] {
  const notifIdx = items.findIndex((m) => m.path === "/admin/notifications");
  const settingsIdx = items.findIndex((m) => m.path === "/admin/settings");
  if (notifIdx === -1 || settingsIdx === -1) return items;
  if (notifIdx === settingsIdx - 1) return items;
  const notif = items[notifIdx];
  const rest = items.filter((_, i) => i !== notifIdx);
  const newSettingsIdx = rest.findIndex((m) => m.path === "/admin/settings");
  rest.splice(newSettingsIdx, 0, notif);
  return rest;
}

export default function AdminLayout() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(() => getAdminNotificationUnreadCount());

  useAdminSocket();

  useEffect(() => {
    const loadAll = async () => {
      setInitialLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Load user and menu in parallel
        const [userData, tabs] = await Promise.all([
          getMe(token).catch(() => null),
          getEnabledAdminTabs().catch(() => null)
        ]);

        if (userData) {
          // Handle avatar URL - fix localhost URLs in production and handle Cloudinary URLs
          const urls = (import.meta.env.VITE_API_URLS || "").split(",").map((url: string) => url.trim()).filter(Boolean);
          const isLocalhost = typeof window !== 'undefined' && (
            window.location.hostname === "localhost" || 
            window.location.hostname === "127.0.0.1"
          );
          const API_BASE_URL = isLocalhost ? urls[0] : (urls[1] || urls[0] || import.meta.env.VITE_API_URL || "");
          const apiBaseWithoutApi = API_BASE_URL ? API_BASE_URL.replace('/api', '') : '';
          
          let avatarUrl = userData.user.avatar;
          if (avatarUrl) {
            // If it's a localhost URL (from development), replace with production API URL
            if (avatarUrl.includes('localhost') || avatarUrl.includes('127.0.0.1')) {
              const urlPath = avatarUrl.replace(/^https?:\/\/[^\/]+/, '');
              avatarUrl = `${apiBaseWithoutApi}${urlPath.startsWith('/') ? urlPath : '/' + urlPath}`;
            } else if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
              // Already a full URL (Cloudinary or production) - use directly
              avatarUrl = avatarUrl;
            } else {
              // Relative path - construct full URL
              avatarUrl = `${apiBaseWithoutApi}${avatarUrl.startsWith('/') ? avatarUrl : '/' + avatarUrl}`;
            }
          }
          
          console.log("AdminLayout - Avatar URL processing:", {
            original: userData.user.avatar,
            isCloudinary: userData.user.avatar?.includes('cloudinary'),
            final: avatarUrl,
            apiBase: API_BASE_URL,
            apiBaseWithoutApi
          });
          
          const fullUser = {
            ...userData.user,
            avatar: avatarUrl
          };
          setUser(fullUser);
        } else {
          navigate("/login");
          return;
        }

        if (tabs) {
          const menuItems: MenuItem[] = tabs.map((tab: any) => {
            // Get icon component from lucide-react by name
            const IconComponent = (LucideIcons as any)[tab.icon] || LayoutDashboard;
            return {
              label: tab.label,
              icon: IconComponent,
              path: tab.path,
            };
          });
          
          // Filter out Sp Console from menu items (it will be shown separately)
          const filteredMenu = menuItems.filter(item => item.path !== "/admin/sp-console");
          // Ensure Queries, Reviews, and Notifications are always in the menu (add if missing from API)
          const requiredItems = [
            { label: "Queries", icon: MessageSquare, path: "/admin/queries" },
            { label: "Reviews", icon: Star, path: "/admin/reviews" },
            { label: "Notifications", icon: Bell, path: "/admin/notifications" },
          ];
          let menuWithRequired = filteredMenu;
          for (const item of requiredItems) {
            if (!menuWithRequired.some(m => m.path === item.path)) {
              menuWithRequired = [...menuWithRequired, item];
            }
          }
          setMenu(putNotificationsAboveSettings(menuWithRequired));
        } else {
          // Fallback to default menu (without Sp Console)
          setMenu(putNotificationsAboveSettings([
            { label: "Dashboard", icon: BarChart3, path: "/admin/dashboard" },
            { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
            { label: "Categories", icon: FolderTree, path: "/admin/categories" },
            { label: "Products", icon: Package, path: "/admin/products" },
            { label: "Assets Panel", icon: ImageIcon, path: "/admin/assets" },
            { label: "Queries", icon: MessageSquare, path: "/admin/queries" },
            { label: "Reviews", icon: Star, path: "/admin/reviews" },
            { label: "Notifications", icon: Bell, path: "/admin/notifications" },
            { label: "Settings", icon: Settings, path: "/admin/settings" },
          ]));
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      } finally {
        setInitialLoading(false);
      }
    };

    loadAll();
  }, [navigate]);

  useEffect(() => {
    setNotificationUnreadCount(getAdminNotificationUnreadCount());
  }, [loc.pathname]);

  useEffect(() => {
    const onNotificationUpdated = () => setNotificationUnreadCount(getAdminNotificationUnreadCount());
    window.addEventListener("adminNotificationUpdated", onNotificationUpdated);
    return () => window.removeEventListener("adminNotificationUpdated", onNotificationUpdated);
  }, []);

  if (initialLoading) {
    return <PageLoader message="GraceByAnu" />;
  }

  // Sidebar content component (reusable for both desktop and mobile)
  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Admin profile: avatar, name, email */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-6 border-b border-white/20 shrink-0">
        <img
          key={user?.avatar || "default"}
          src={user?.avatar || "/avatar.png"}
          alt={user?.name || "Admin"}
          className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shrink-0"
          crossOrigin="anonymous"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== "/avatar.png" && !target.src.includes("avatar.png")) {
              target.src = "/avatar.png";
            }
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight truncate text-white">
            {user?.name || "Admin"}
          </p>
          <p className="text-sm text-white/80 truncate">
            {user?.email || ""}
          </p>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2 mt-6 px-2 flex-1 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = loc.pathname.startsWith(item.path);

          const isNotifications = item.path === "/admin/notifications";
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition
              ${active ? "text-white font-semibold shadow-md" : "hover:bg-white/10 text-white/80"}`}
              style={{
                backgroundColor: active ? "var(--theme-dark)" : "transparent",
              }}
            >
              <Icon size={18} />
              {item.label}
              {isNotifications && notificationUnreadCount > 0 && (
                <span
                  className="min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center text-white ml-auto"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                >
                  {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* SP CONSOLE & LOGOUT BUTTONS (bottom) – same style as Developer "Back to Admin" */}
      <div className="mt-auto px-2 space-y-2 shrink-0">
        <Link
          to="/admin/sp-console"
          onClick={onLinkClick}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition w-full
            ${loc.pathname === "/admin/sp-console" ? "text-white font-semibold shadow-md" : "hover:bg-white/10 text-white/80"}`}
          style={{
            backgroundColor: loc.pathname === "/admin/sp-console" ? "var(--theme-dark)" : "transparent",
          }}
        >
          <Cog size={18} />
          Sp Console
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
            if (onLinkClick) onLinkClick();
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 w-full text-white/80 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* ============ MOBILE DRAWER ============ */}
      <div className="lg:hidden fixed top-4 left-4 z-[100]">
        <Button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="h-10 w-10 p-0 bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300 shadow-lg rounded-lg flex items-center justify-center"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>
      
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 text-white border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:hover:bg-white/10"
          style={{ 
            background: `linear-gradient(to bottom, var(--theme-dark), var(--theme-primary))`
          }}
        >
          <div className="flex flex-col h-full py-6">
            <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside 
        className="hidden lg:flex w-64 text-white flex-col shadow-lg fixed left-0 top-0 h-screen overflow-y-auto"
        style={{ 
          background: `linear-gradient(to bottom, var(--theme-dark), var(--theme-primary))`
        }}
      >
        <SidebarContent />
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 w-full lg:ml-64 pt-16 lg:pt-8 p-4 lg:p-8 bg-gray-50">
         <React.Suspense fallback={<PageLoader message="GraceByAnu" />}>
          <div 
            key={loc.pathname} 
            className="animate-fade-in"
            style={{
              animation: "fadeInSlide 0.5s ease-out",
            }}
          >
            <Outlet />
          </div>
        </React.Suspense>
      </main>
    </div>
  );
}
