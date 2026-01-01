import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function FilterTabs({ tabs, activeTab, onTabChange, className = "" }: FilterTabsProps) {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`px-4 py-1.5 rounded-md border transition-all duration-200 ${
              isActive
                ? "theme-button text-white border-transparent hover:opacity-90"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

