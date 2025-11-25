import React, { useState } from "react";
import { Link, useLocation  } from "react-router-dom";
import { Menu, ShoppingCart } from "lucide-react";
import Button from "../ui/buttons/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/lib/ThemeProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  const linkClasses = (path: string) =>
    `text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
     ${pathname === path ? "underline underline-offset-4 font-medium" : ""}`;
  return (
    <header className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm fixed top-0 w-full z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <Link
          to="/"
          className="text-xl font-serif font-semibold flex items-center gap-2"
        >
          <span>🏛️</span> VERES
        </Link>

        {/* CENTER: Nav links (desktop only) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={linkClasses("/")}>Home</Link>
          <Link to="/shop" className={linkClasses("/shop")}>Shop</Link>
        </nav>

        {/* RIGHT: Cart + Sign In + Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Cart icon (always visible) */}
          <Link to="/cart" className="relative cursor-pointer">
  <ShoppingCart className="w-6 h-6 text-gray-700" />
  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
    0
  </span>
</Link>
{/* <button
  onClick={toggleTheme}
  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
>
  {theme === "light" ? "🌙" : "☀️"}
</button> */}

          {/* Sign In (desktop only) */}
          <div className="hidden md:block">
            <Button className="border text-gray-700 bg-white dark:bg-gray-900 dark:text-white hover:bg-gray-100">
              Sign In
            </Button>
          </div>

          {/* Hamburger menu (mobile only) */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  className="p-2 bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-0 border-0"
                >
                  <Menu className="w-6 h-6 text-black dark:text-white" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 text-black dark:text-white p-6 shadow-lg flex flex-col z-50"
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
                  {/* <Link
                    to="/pages"
                    onClick={() => setOpen(false)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Pages
                  </Link> */}
                  {/* <Link
                    to="/blog"
                    onClick={() => setOpen(false)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Blog
                  </Link> */}
                </nav>

                <Button className="mt-auto border border-gray-300 text-gray-700 bg-white dark:bg-gray-900 dark:text-white hover:bg-gray-100">
                  Sign In
                </Button>
                
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
