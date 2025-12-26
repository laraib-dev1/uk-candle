import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/buttons/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/lib/ThemeProvider";
import { useCart } from "../products/CartContext";
import { Menu, ShoppingCart, LogOut, User } from "lucide-react";
import { getCompany } from "@/api/company.api";
import * as LucideIcons from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const { totalItems } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navLoading, setNavLoading] = useState(false);
  const [company, setCompany] = useState<{ logo: string; company: string }>({ logo: "", company: "" });

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data = await getCompany();
        setCompany({ logo: data.logo || "/logo-removebg-preview.png", company: data.company || "Grace by Anu" });
      } catch (error) {
        console.error("Failed to load company:", error);
        setCompany({ logo: "/logo-removebg-preview.png", company: "Grace by Anu" });
      }
    };
    loadCompany();
  }, []);

//   const storedUser = localStorage.getItem("user");
// const user = storedUser ? JSON.parse(storedUser) : null;
let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.warn("Failed to parse user from localStorage", err);
    user = null; // fallback if parsing fails
  }
 const linkClasses = (path: string) => {
  const base = "text-sm transition-colors";
  const color = pathname === path 
    ? "font-medium underline underline-offset-4" 
    : "";

  return `${base} ${color}`;
};

  return (
    <header className="bg-white  text-black  shadow-sm fixed top-0 w-full z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <Link
          to="/"
          className="text-xl font-serif font-semibold flex items-center gap-2"
          style={{ color: "var(--theme-primary)" }}
        >
          {company.logo && (
            <img
              src={company.logo.startsWith("http") ? company.logo : (company.logo ? `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}${company.logo.startsWith("/") ? "" : "/"}${company.logo}` : "/logo-removebg-preview.png")}
              alt="Logo"
              className="w-16 h-16 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo-removebg-preview.png";
              }}
            />
          )}
          {company.company}
        </Link>

        {/* CENTER: Nav links (desktop only) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={linkClasses("/")}
            style={{ 
              color: pathname === "/" ? "var(--theme-primary)" : "var(--theme-dark)",
            }}
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            className={linkClasses("/shop")}
            style={{ 
              color: pathname === "/shop" ? "var(--theme-primary)" : "var(--theme-dark)",
            }}
          >
            Shop
          </Link>
        </nav>

        {/* RIGHT: Cart + Sign In + Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Cart icon (always visible) */}
          <Link to="/cart" className="relative cursor-pointer">
  <ShoppingCart className="w-6 h-6 text-gray-700 " />
  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
  {totalItems}
</span>
</Link>
{/* Theme toggle button */}
{/* <button
  onClick={toggleTheme}
  className="p-2 rounded-lg bg-white  text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
  title="Toggle Theme"
>
  {theme === "light" ? "🌙" : "☀️"}
</button> */}


          {/* Sign In (desktop only) */}
          {/* <div className="hidden md:block">
            <Button className="border text-gray-700 bg-white  hover:bg-gray-100" onClick={() => navigate("/login")} >
              Sign In
            </Button>
          </div> */}
          <div className="hidden md:block">
  {!user ? (
    <Button
      className="border text-white"
      style={{
        backgroundColor: "var(--theme-primary)",
        borderColor: "var(--theme-primary)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--theme-dark)";
        e.currentTarget.style.borderColor = "var(--theme-dark)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--theme-primary)";
        e.currentTarget.style.borderColor = "var(--theme-primary)";
      }}
      onClick={async () => {
        if (navLoading) return;
        setNavLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          navigate("/login");
        } finally {
          setNavLoading(false);
        }
      }}
      loading={navLoading}
    >
      Sign In
    </Button>
  ) : (
     <div className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                title="Profile"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <div className="p-4 text-black border-b">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-black"
                  >
                    <User size={16} /> Profile
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      localStorage.removeItem("token");
                      setDropdownOpen(false);
                      navigate("/login");
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-500"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
    
  )}
</div>


          {/* Hamburger menu (mobile only) */}
          <div className="md:hidden text-black">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  className="p-2 bg-gray-100 text-black hover:bg-gray-100 focus:outline-none focus:ring-0 border-0"
                >
                  <Menu className="w-6 h-6 text-black" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="fixed top-0 right-0 h-full w-64 bg-white text-black p-6 shadow-lg flex flex-col z-50"
              >
                <nav className="flex flex-col gap-4 mt-4">
                  <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Home
                  </Link>
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Shop
                  </Link>
                </nav>

                {/* <Button className="mt-auto border border-gray-300 text-gray-700 bg-white dark:bg-gray-900 dark:text-white hover:bg-gray-100">
                  Sign In
                </Button> */}
                {!user ? (
  <Button
    className="mt-auto border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
    onClick={async () => {
      if (navLoading) return;
      setNavLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        setOpen(false);
        navigate("/login");
      } finally {
        setNavLoading(false);
      }
    }}
    loading={navLoading}
  >
    Sign In
  </Button>
) : (
  <Button
    className="mt-auto border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
    onClick={() => {
      setOpen(false);
      navigate("/profile");
    }}
  >
    Profile
  </Button>
)}

                
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
