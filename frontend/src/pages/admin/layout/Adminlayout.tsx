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
  const [activeTabIndex, setActiveTabIndex] = useState(-1);

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
          // Use avatar URL as-is if it's already a full URL (Cloudinary), otherwise prepend API URL
          // Use same logic as axios.ts to get correct API URL for production
          const urls = (import.meta.env.VITE_API_URLS || "").split(",").map((url: string) => url.trim()).filter(Boolean);
          const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
          const API_BASE_URL = isLocalhost ? urls[0] : (urls[1] || urls[0] || import.meta.env.VITE_API_URL || "");
          const apiBaseWithoutApi = API_BASE_URL ? API_BASE_URL.replace('/api', '') : '';
          
          console.log("Admin Layout - User data:", userData.user);
          console.log("Admin Layout - Avatar from API:", userData.user.avatar);
          console.log("Admin Layout - API Base URL:", API_BASE_URL);
          console.log("Admin Layout - API Base without /api:", apiBaseWithoutApi);
          
          // Cloudinary URLs are already full URLs, use as-is
          // Backend returns Cloudinary secure_url directly, so use it as-is
          let avatarUrl = userData.user.avatar;
          if (avatarUrl) {
            // Cloudinary URLs start with https://res.cloudinary.com/
            // If it's already a full URL, use directly
            if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
              avatarUrl = avatarUrl;
            } else {
              // Relative path - construct full URL (shouldn't happen with Cloudinary)
              avatarUrl = `${apiBaseWithoutApi}${avatarUrl.startsWith('/') ? avatarUrl : '/' + avatarUrl}`;
            }
          }
          
          console.log("Admin Layout - Final avatar URL:", avatarUrl);
          console.log("Admin Layout - Avatar URL type check:", {
            original: userData.user.avatar,
            isCloudinary: userData.user.avatar?.includes('cloudinary'),
            final: avatarUrl
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

  // Update active tab index when location changes (must be before early return)
  useEffect(() => {
    if (menu.length > 0) {
      // Normalize paths for comparison
      const currentPath = loc.pathname.toLowerCase().trim();
      
      // First try exact match
      let activeIndex = menu.findIndex(item => {
        const itemPath = item.path.toLowerCase().trim();
        return currentPath === itemPath;
      });
      
      // If no exact match, try startsWith (for nested routes)
      if (activeIndex < 0) {
        activeIndex = menu.findIndex(item => {
          const itemPath = item.path.toLowerCase().trim();
          // Check if current path starts with item path followed by / or end of string
          return currentPath.startsWith(itemPath + '/') || currentPath.startsWith(itemPath);
        });
      }
      
      // If still no match, try matching the last segment (e.g., /admin/orders matches "orders")
      if (activeIndex < 0) {
        const currentSegments = currentPath.split('/').filter(Boolean);
        const lastSegment = currentSegments[currentSegments.length - 1];
        
        activeIndex = menu.findIndex(item => {
          const itemSegments = item.path.toLowerCase().split('/').filter(Boolean);
          const itemLastSegment = itemSegments[itemSegments.length - 1];
          return lastSegment === itemLastSegment && itemSegments.length > 1;
        });
      }
      
      if (activeIndex >= 0) {
        setActiveTabIndex(activeIndex);
      } else {
        // Reset if no match found
        setActiveTabIndex(-1);
      }
    }
  }, [loc.pathname, menu]);

  if (initialLoading) {
    return <PageLoader message="GraceByAnu" />;
  }

  // Sidebar content component (reusable for both desktop and mobile)
  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
    // py-2.5 = 10px top + 10px bottom = 20px total vertical padding
    // Icon size 18px + text ~20px = ~38px content height
    // Total: 20px padding + 38px content = 58px, but we use 50px to account for line-height
    const itemHeight = 50; // Full height including padding (py-2.5 = 10px top + 10px bottom + content)
    const itemGap = 8; // gap-2 = 8px
    // Calculate indicator position - only show if we have a valid active index
    const hasActiveTab = activeTabIndex >= 0 && activeTabIndex < menu.length;
    const indicatorTop = hasActiveTab ? activeTabIndex * (itemHeight + itemGap) : -100;

    return (
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
      <nav className="flex flex-col gap-2 mt-6 px-2 flex-1 overflow-y-auto relative">
        {/* Sliding background indicator - More visible with shadow and border */}
        {menu.length > 0 && (
          <div 
            key={`indicator-${activeTabIndex}-${loc.pathname}`}
            className="absolute left-2 right-2 rounded-lg pointer-events-none"
            style={{
              height: `${itemHeight}px`,
              backgroundColor: "var(--theme-dark)",
              transform: `translateY(${indicatorTop}px)`,
              zIndex: 0,
              opacity: hasActiveTab ? 1 : 0,
              willChange: 'transform',
              transition: 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease-out',
              boxShadow: hasActiveTab ? '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : 'none',
              border: hasActiveTab ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
            }}
          />
        )}
        {menu.map((item, index) => {
          const Icon = item.icon;
          const active = loc.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg relative z-10
              ${active ? "text-white font-semibold" : "hover:bg-white/10 text-white/80"}`}
              style={{
                backgroundColor: "transparent",
                minHeight: "50px",
                transition: "all 300ms ease-out",
              }}
            >
              <div
                className="relative z-10"
                style={{
                  transform: active ? "scale(1.15)" : "scale(1)",
                  transition: "transform 300ms ease-out",
                }}
              >
                <Icon size={18} />
              </div>
              <span className="relative z-10" style={{ transition: "all 300ms ease-out" }}>{item.label}</span>
              {/* Left border indicator for active tab */}
              {active && (
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                  style={{
                    backgroundColor: "white",
                    transition: "all 300ms ease-out",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* SP CONSOLE & LOGOUT BUTTONS (bottom) */}
      <div className="mt-auto px-2 space-y-2 flex-shrink-0">
        <div className="relative">
          {/* Sliding background for Sp Console */}
          <div 
            className="absolute left-2 right-2 rounded-lg transition-all duration-700 ease-out pointer-events-none"
            style={{
              height: "50px",
              backgroundColor: "var(--theme-dark)",
              opacity: loc.pathname === "/admin/sp-console" ? "1" : "0",
              transform: "translateY(0)",
              zIndex: 0,
            }}
          />
          <Link
            to="/admin/sp-console"
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-700 ease-out w-full relative z-10
              ${loc.pathname === "/admin/sp-console" ? "text-white font-semibold" : "hover:bg-white/10 text-white/80"}`}
            style={{
              backgroundColor: "transparent",
              minHeight: "50px",
            }}
          >
            <Cog 
              size={18} 
              className="transition-all duration-700 ease-out relative z-10"
              style={{
                transform: loc.pathname === "/admin/sp-console" ? "scale(1.15)" : "scale(1)",
              }}
            />
            <span className="transition-all duration-700 ease-out relative z-10">Sp Console</span>
          </Link>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
            if (onLinkClick) onLinkClick();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 w-full text-white/80 hover:text-white transition-colors"
          style={{
            minHeight: "50px",
          }}
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
    );
  };

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
      <main className="flex-1 w-full lg:ml-64 pt-16 lg:pt-8 p-4 lg:p-8 text-black">
         <React.Suspense fallback={<PageLoader message="GraceByAnu" />}>
          <div 
            key={loc.pathname} 
            className="animate-fade-in text-black"
            style={{
              animation: "fadeInSlide 0.5s ease-out",
              color: "#000000",
            }}
          >
            <Outlet />
          </div>
        </React.Suspense>
      </main>
    </div>
  );
}
