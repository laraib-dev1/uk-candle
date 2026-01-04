import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth"; // adjust path
import PageLoader from "@/components/ui/PageLoader";

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

export default function AdminLayout() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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
          // prepend backend URL if avatar exists and doesn't already start with http
          const avatarUrl = userData.user.avatar 
            ? (userData.user.avatar.startsWith('http') 
                ? userData.user.avatar 
                : `${import.meta.env.VITE_API_URL}${userData.user.avatar.startsWith('/') ? userData.user.avatar : '/' + userData.user.avatar}`)
            : undefined;
          
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
          
          setMenu(filteredMenu);
        } else {
          // Fallback to default menu (without Sp Console)
          setMenu([
            { label: "Dashboard", icon: BarChart3, path: "/admin/dashboard" },
            { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
            { label: "Categories", icon: FolderTree, path: "/admin/categories" },
            { label: "Products", icon: Package, path: "/admin/products" },
            { label: "Assets Panel", icon: ImageIcon, path: "/admin/assets" },
            { label: "Queries", icon: MessageSquare, path: "/admin/queries" },
            { label: "Reviews", icon: Star, path: "/admin/reviews" },
            { label: "Settings", icon: Settings, path: "/admin/settings" },
          ]);
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

  if (initialLoading) {
    return <PageLoader message="Loading admin panel..." />;
  }

  // Sidebar content component (reusable for both desktop and mobile)
  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Profile Box */}
      <div className="flex items-center gap-3 px-5 pb-6 border-b border-white/20 flex-shrink-0">
        <img
          key={user?.avatar || "default"}
          src={user?.avatar || "/avatar.png"}
          alt={user?.name || "User"}
          className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== "/avatar.png" && !target.src.includes("avatar.png")) {
              target.src = "/avatar.png";
            }
          }}
          onLoad={() => {
            // Image loaded successfully
          }}
        />
        <div>
          <h4 className="font-semibold leading-5">{user?.name || "Full Name"}</h4>
          <p className="text-sm opacity-80">{user?.email || "user@gmail.com"}</p>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2 mt-6 px-2 flex-1 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = loc.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition
              ${active ? "text-white font-semibold shadow-md" : "hover:bg-white/10"}`}
              style={{
                backgroundColor: active ? "var(--theme-dark)" : "transparent",
              }}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* SP CONSOLE & LOGOUT BUTTONS (bottom) */}
      <div className="mt-auto px-2 space-y-2 flex-shrink-0">
        <Link
          to="/admin/sp-console"
          onClick={onLinkClick}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition w-full
            ${loc.pathname === "/admin/sp-console" ? "text-white font-semibold shadow-md" : "hover:bg-white/10"}`}
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
          <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside 
        className="hidden lg:flex w-64 text-white flex-col py-6 shadow-lg fixed left-0 top-0 h-screen overflow-y-auto"
        style={{ 
          background: `linear-gradient(to bottom, var(--theme-dark), var(--theme-primary))`
        }}
      >
        <SidebarContent />
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 w-full lg:ml-64 pt-16 lg:pt-8 p-4 lg:p-8">
         <React.Suspense fallback={<PageLoader message="GraceByAnu" />}>
      <Outlet />
    </React.Suspense>
      </main>
    </div>
  );
}
