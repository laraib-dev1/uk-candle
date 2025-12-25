import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth"; // adjust path

import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
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
  FolderOpen,
  Palette,
  Sliders,
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

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const data = await getMe(token);
        // prepend backend URL if avatar exists and doesn't already start with http
        const avatarUrl = data.user.avatar 
          ? (data.user.avatar.startsWith('http') 
              ? data.user.avatar 
              : `${import.meta.env.VITE_API_URL}${data.user.avatar.startsWith('/') ? data.user.avatar : '/' + data.user.avatar}`)
          : undefined;
        
        const fullUser = {
          ...data.user,
          avatar: avatarUrl
        };
        setUser(fullUser);
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };

    loadUser();
  }, [navigate]);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const tabs = await getEnabledAdminTabs();
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
      } catch (error) {
        console.error("Failed to load admin tabs:", error);
        // Fallback to default menu (without Sp Console)
        setMenu([
          { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
          { label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
          { label: "Queries", icon: MessageSquare, path: "/admin/queries" },
          { label: "Products", icon: Package, path: "/admin/products" },
          { label: "Categories", icon: FolderOpen, path: "/admin/categories" },
          { label: "Assets Panel", icon: Palette, path: "/admin/assets" },
          { label: "Setting", icon: Sliders, path: "/admin/settings" },
        ]);
      }
    };

    loadMenu();
  }, []);

  // Sidebar content component (reusable for both desktop and mobile)
  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      {/* Profile Box */}
      <div className="flex items-center gap-3 px-5 pb-6 border-b border-white/20">
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
      <nav className="flex flex-col gap-2 mt-6 px-2">
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
      <div className="mt-auto px-2 space-y-2">
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
    </>
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
        className="hidden lg:flex w-64 text-white flex-col py-6 shadow-lg"
        style={{ 
          background: `linear-gradient(to bottom, var(--theme-dark), var(--theme-primary))`
        }}
      >
        <SidebarContent />
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 w-full lg:w-auto pt-16 lg:pt-8 p-4 lg:p-8">
         <React.Suspense fallback={<div>Loading admin page...</div>}>
      <Outlet />
    </React.Suspense>
      </main>
    </div>
  );
}
