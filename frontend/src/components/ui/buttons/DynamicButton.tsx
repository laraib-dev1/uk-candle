// components/ui/DynamicButton.tsx
import React from "react";
import clsx from "clsx";

interface DynamicButtonProps {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  variant?: "filled" | "transparent";
  shape?: "rounded" | "pill" | "square";
  className?: string;
}

const DynamicButton: React.FC<DynamicButtonProps> = ({
  label,
  onClick,
  loading = false,
  variant = "filled",
  shape = "rounded",
  className = "",
}) => {
  const baseClasses =
    "px-5 py-2 font-medium transition-all duration-200 flex items-center justify-center gap-2";

  const variants = {
  filled: "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700",
  transparent: "bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-300 dark:hover:bg-gray-800",
};


  const shapes = {
    rounded: "rounded-md",
    pill: "rounded-full",
    square: "rounded-none",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={clsx(
        baseClasses,
        variants[variant],
        shapes[shape],
        loading && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <>
          <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
          Loading...
        </>
      ) : (
        label
      )}
    </button>
  );
};

export default DynamicButton;
