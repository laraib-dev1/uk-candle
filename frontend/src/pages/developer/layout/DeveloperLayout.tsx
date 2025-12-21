import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FileText,
  PanelBottom,
  ArrowLeft,
} from "lucide-react";
import { getMe } from "@/api/auth.api";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function DeveloperLayout() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);

  // Check developer authentication
  useEffect(() => {
    const developerAuth = localStorage.getItem("developerAuth");
    if (!developerAuth) {
      navigate("/admin/sp-console");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const data = await getMe(token);
        const fullUser = {
          ...data.user,
          avatar: data.user.avatar
            ? `${import.meta.env.VITE_API_URL}${data.user.avatar}`
            : undefined,
        };
        setUser(fullUser);
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };

    loadUser();
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
      <aside className="w-64 bg-gradient-to-b from-[#6B5344] to-[#4A3728] text-white flex flex-col py-6 shadow-lg">
        {/* Developer Badge */}
        <div className="px-5 pb-4">
          <span className="text-orange-400 font-bold text-sm tracking-wider">
            Developer
          </span>
        </div>

        {/* Profile Box */}
        <div className="flex items-center gap-3 px-5 pb-6 border-b border-white/20">
          <img
            src={user?.avatar || "/avatar.png"}
            alt={user?.name || "User"}
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-400"
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
            const active = loc.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition
                ${
                  active
                    ? "bg-[#8B7355] text-white font-semibold shadow-md"
                    : "hover:bg-white/10"
                }`}
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
