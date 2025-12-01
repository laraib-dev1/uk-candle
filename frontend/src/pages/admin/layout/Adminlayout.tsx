import React from "react";
import { useNavigate } from "react-router-dom";

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
} from "lucide-react";

export default function AdminLayout() {
  const loc = useLocation();

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
    { label: "Products", icon: Package, path: "/admin/products" },
    { label: "Categories", icon: Layers, path: "/admin/categories" },
    { label: "Assets Panel", icon: ImageIcon, path: "/admin/assets" },
    { label: "Notifications", icon: Bell, path: "/admin/notifications" },
    { label: "Setting", icon: Settings, path: "/admin/settings" },
  ];
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-white">

      {/* ============ SIDEBAR ============ */}
      <aside className="w-64 bg-[#A8734B] text-white flex flex-col py-6 shadow-lg">

        {/* Profile Box */}
        <div className="flex items-center gap-3 px-5 pb-6 border-b border-white/20">
          <img
            src="/avatar.png"
            alt="User"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold leading-5">Full Name</h4>
            <p className="text-sm opacity-80">user@gmail.com</p>
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
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${active ? "bg-white text-[#A8734B] font-semibold" : "hover:bg-white/20"}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON (bottom) */}
        <div className="mt-auto px-2">
          <button
  onClick={() => {
    localStorage.removeItem("token");
    navigate("/login");
  }}
  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/20 w-full"
>
  <LogOut size={18} />
  Log out
</button>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 p-8">
         <React.Suspense fallback={<div>Loading admin page...</div>}>
      <Outlet />
    </React.Suspense>
      </main>
    </div>
  );
}
