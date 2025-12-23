import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  noFocusRing?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className = "",
  noFocusRing = false,
  loading = false,
  disabled,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      {...props}
      disabled={isDisabled}
      className={cn(
        // Default button style
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium",
        "bg-black text-white hover:bg-gray-800 transition",

        // Remove focus/active outlines if needed
        noFocusRing
          ? "focus:outline-none focus:ring-0 active:outline-none active:ring-0"
          : "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",

        loading && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      {loading && (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
