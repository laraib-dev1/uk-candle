import React from "react";

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div 
            className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[var(--theme-primary)] rounded-full animate-spin"
            style={{ borderTopColor: "var(--theme-primary)" }}
          ></div>
        </div>
        {message && (
          <p className="text-gray-600 font-medium animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}
