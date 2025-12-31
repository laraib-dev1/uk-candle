import React from "react";
import { cn } from "@/lib/utils";

export interface FilterTab {
  value: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  tabClassName?: string;
}

export default function FilterTabs({
  tabs,
  value,
  onChange,
  className,
  tabClassName,
}: FilterTabsProps) {
  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      {tabs.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              "border border-transparent",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-primary)]",
              isActive
                ? "bg-[var(--theme-primary)] text-white shadow-sm"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
              tabClassName
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

