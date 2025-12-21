import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FileText,
  PanelBottom,
  ArrowLeft,
  Cog,
} from "lucide-react";

export default function DeveloperLayout() {
  const loc = useLocation();
  const navigate = useNavigate();

  // Check developer authentication
  useEffect(() => {
    const developerAuth = localStorage.getItem("developerAuth");
    if (!developerAuth) {
      navigate("/admin/sp-console");
      return;
    }
  }, [navigate]);

  const menu = [
    { label: "Admin Tabs", icon: LayoutDashboard, path: "/developer/admin-tabs" },
    { label: "Company", icon: Building2, path: "/developer/company" },
    { label: "Web Pages", icon: FileText, path: "/developer/web-pages" },
    { label: "Footer", icon: PanelBottom, path: "/developer/footer" },
  ];

  const handleBackToAdmin = () => {
    localStorage.removeItem("developerAuth");
    localStorage.removeItem("developerAuthTime");
    navigate("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* ============ SIDEBAR ============ */}
      <aside 
        className="w-64 text-white flex flex-col py-6 shadow-lg"
        style={{ 
          background: `linear-gradient(to bottom, var(--theme-dark), var(--theme-primary))`
        }}
      >
        {/* Developer Badge */}
        <div className="px-5 pb-6 border-b border-white/20">
          <span 
            className="font-bold text-sm tracking-wider"
            style={{ color: "var(--theme-accent)" }}
          >
            Developer
          </span>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-2 mt-6 px-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = loc.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
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

        {/* BACK TO ADMIN BUTTON (bottom) */}
        <div className="mt-auto px-2">
          <button
            onClick={handleBackToAdmin}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 w-full text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Admin
          </button>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 p-8 bg-gray-50">
        <React.Suspense fallback={<div>Loading developer page...</div>}>
          <Outlet />
        </React.Suspense>
      </main>
    </div>
  );
}
