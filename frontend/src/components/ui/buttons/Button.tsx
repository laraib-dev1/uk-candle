import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  noFocusRing?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  noFocusRing = false,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        // Default button style
        "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium",
        "bg-black text-white hover:bg-gray-800 transition",

        // Remove focus/active outlines if needed
        noFocusRing
          ? "focus:outline-none focus:ring-0 active:outline-none active:ring-0"
          : "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",

        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
