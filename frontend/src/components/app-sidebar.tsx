import { Link } from "react-router-dom";
import { Home, ShoppingBag, BookOpen, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Button from "./ui/buttons/Button";
import { useNavigate } from "react-router-dom";

interface AppSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  user?: any;
  company?: { company: string };
  navLoading?: boolean;
}

export function AppSidebar({ 
  open, 
  onOpenChange, 
  user, 
  company,
  navLoading 
}: AppSidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Shop",
      url: "/shop",
      icon: ShoppingBag,
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: BookOpen,
    },
    {
      title: "About Us",
      url: "/about-us",
      icon: User,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="fixed top-0 right-0 h-full w-64 bg-white text-black p-6 shadow-lg flex flex-col z-50"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="flex flex-col gap-4 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              onClick={() => onOpenChange?.(false)}
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-2"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        {user ? (
          <div className="mt-auto flex flex-col gap-2">
            <Button
              className="w-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 flex items-center gap-2 justify-start"
              onClick={() => {
                onOpenChange?.(false);
                navigate("/profile");
              }}
            >
              <User size={16} /> Profile
            </Button>
            <Button
              className="w-full border border-gray-300 text-red-500 bg-white hover:bg-red-50 flex items-center gap-2 justify-start"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                onOpenChange?.(false);
                navigate("/login");
              }}
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
        ) : (
          <Button
            className="mt-auto border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
            onClick={async () => {
              if (navLoading) return;
              onOpenChange?.(false);
              navigate("/login");
            }}
            loading={navLoading}
          >
            Sign In
          </Button>
        )}

        {/* Mini Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p className="font-semibold mb-1" style={{ color: "var(--theme-primary)" }}>
              {company?.company || "Grace by Anu"}
            </p>
            <p>© {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
