import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SpComponentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [visibleSections, setVisibleSections] = useState({
    buttons: true,
    inputs: true,
    pickers: true,
    itemCard: true,
    text: true,
    sidebar: true,
    options: true,
    categories: true,
    standards: true,
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold theme-heading mb-2">SP Components</h1>
        <p className="text-gray-600">Component showcase and design standards</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-gray-100">
          <TabsTrigger value="all" className="data-[state=active]:bg-theme-primary data-[state=active]:text-white">
            All
          </TabsTrigger>
          <TabsTrigger value="buttons" className="data-[state=active]:bg-theme-primary data-[state=active]:text-white">
            Buttons
          </TabsTrigger>
          <TabsTrigger value="inputs" className="data-[state=active]:bg-theme-primary data-[state=active]:text-white">
            Inputs
          </TabsTrigger>
          <TabsTrigger value="text" className="data-[state=active]:bg-theme-primary data-[state=active]:text-white">
            Text
          </TabsTrigger>
          <TabsTrigger value="sidebar" className="data-[state=active]:bg-theme-primary data-[state=active]:text-white">
            Sidebar Tabs
          </TabsTrigger>
          <TabsTrigger value="options" className="data-[state=active]:bg-theme-primary data-[state=active]:text-white">
            Options Menu
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-theme-primary data-[state=active]:text-white">
            Categories
          </TabsTrigger>
        </TabsList>

        {/* All Tab */}
        <TabsContent value="all" className="mt-6">
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 space-y-8">
            {/* Buttons Section */}
            <ButtonsShowcase visible={visibleSections.buttons} onToggle={(val) => setVisibleSections({...visibleSections, buttons: val})} />

            {/* Inputs Section */}
            <InputsShowcase visible={visibleSections.inputs} onToggle={(val) => setVisibleSections({...visibleSections, inputs: val})} />

            {/* Pickers Section */}
            <PickersShowcase visible={visibleSections.pickers} onToggle={(val) => setVisibleSections({...visibleSections, pickers: val})} />

            {/* Item Card Section */}
            <ItemCardShowcase visible={visibleSections.itemCard} onToggle={(val) => setVisibleSections({...visibleSections, itemCard: val})} />

            {/* Text Section */}
            <TextShowcase visible={visibleSections.text} onToggle={(val) => setVisibleSections({...visibleSections, text: val})} />

            {/* Sidebar Tabs Section */}
            <SidebarTabsShowcase visible={visibleSections.sidebar} onToggle={(val) => setVisibleSections({...visibleSections, sidebar: val})} />

            {/* Options Menu Section */}
            <OptionsMenuShowcase visible={visibleSections.options} onToggle={(val) => setVisibleSections({...visibleSections, options: val})} />

            {/* Categories Section */}
            <CategoriesShowcase visible={visibleSections.categories} onToggle={(val) => setVisibleSections({...visibleSections, categories: val})} />

            {/* Standards Section */}
            <StandardsSection visible={visibleSections.standards} onToggle={(val) => setVisibleSections({...visibleSections, standards: val})} />
          </div>
        </TabsContent>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="mt-6">
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
            <ButtonsShowcase visible={visibleSections.buttons} onToggle={(val) => setVisibleSections({...visibleSections, buttons: val})} />
          </div>
        </TabsContent>

        {/* Inputs Tab */}
        <TabsContent value="inputs" className="mt-6">
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
            <InputsShowcase visible={visibleSections.inputs} onToggle={(val) => setVisibleSections({...visibleSections, inputs: val})} />
          </div>
        </TabsContent>

        {/* Text Tab */}
        <TabsContent value="text" className="mt-6">
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
            <TextShowcase visible={visibleSections.text} onToggle={(val) => setVisibleSections({...visibleSections, text: val})} />
          </div>
        </TabsContent>

        {/* Sidebar Tabs Tab */}
        <TabsContent value="sidebar" className="mt-6">
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
            <SidebarTabsShowcase visible={visibleSections.sidebar} onToggle={(val) => setVisibleSections({...visibleSections, sidebar: val})} />
          </div>
        </TabsContent>

        {/* Options Menu Tab */}
        <TabsContent value="options" className="mt-6">
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
            <OptionsMenuShowcase visible={visibleSections.options} onToggle={(val) => setVisibleSections({...visibleSections, options: val})} />
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="mt-6">
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
            <CategoriesShowcase visible={visibleSections.categories} onToggle={(val) => setVisibleSections({...visibleSections, categories: val})} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Buttons Showcase Component
function ButtonsShowcase({ visible, onToggle }: { visible: boolean; onToggle: (val: boolean) => void }) {
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Buttons</h2>
          <p className="text-sm text-gray-500">Outline / Grey / Default / - / Hover / Onpress</p>
        </div>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {visible && (
        <div className="flex flex-wrap gap-4">
        {/* Outline Button */}
        <button
          className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onMouseEnter={() => setIsHovered("outline")}
          onMouseLeave={() => setIsHovered(null)}
          onMouseDown={() => setIsPressed("outline")}
          onMouseUp={() => setIsPressed(null)}
          style={{
            backgroundColor: isPressed === "outline" ? "#f3f4f6" : isHovered === "outline" ? "#f9fafb" : "white",
          }}
        >
          Add
        </button>

        {/* Grey/Fill Button */}
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors opacity-70"
          onMouseEnter={() => setIsHovered("grey")}
          onMouseLeave={() => setIsHovered(null)}
          onMouseDown={() => setIsPressed("grey")}
          onMouseUp={() => setIsPressed(null)}
          style={{
            backgroundColor: isPressed === "grey" ? "#374151" : isHovered === "grey" ? "#4b5563" : "#6b7280",
          }}
        >
          Add
        </button>

        {/* Default/Theme Button */}
        <button
          className="px-4 py-2 text-white rounded-md transition-colors theme-button"
          onMouseEnter={() => setIsHovered("default")}
          onMouseLeave={() => setIsHovered(null)}
          onMouseDown={() => setIsPressed("default")}
          onMouseUp={() => setIsPressed(null)}
          style={{
            backgroundColor: isPressed === "default" ? "var(--theme-dark)" : isHovered === "default" ? "var(--theme-dark)" : "var(--theme-primary)",
          }}
        >
          Add
        </button>

        {/* Theme Button with rounded-6 */}
        <button
          className="px-4 py-2 text-white rounded-md transition-colors"
          style={{
            backgroundColor: "var(--theme-primary)",
            borderRadius: "6px",
            fontSize: "18px",
          }}
        >
          Add
        </button>

        {/* Theme Button with rounded-10 */}
        <button
          className="px-4 py-2 text-white rounded-lg transition-colors"
          style={{
            backgroundColor: "var(--theme-primary)",
            borderRadius: "10px",
            fontSize: "18px",
          }}
        >
          Add
        </button>

        {/* Theme Button with rounded-full */}
        <button
          className="px-4 py-2 text-white rounded-full transition-colors"
          style={{
            backgroundColor: "var(--theme-primary)",
            fontSize: "18px",
          }}
        >
          Add
        </button>
        </div>
      )}
    </div>
  );
}

// Inputs Showcase Component
function InputsShowcase({ visible, onToggle }: { visible: boolean; onToggle: (val: boolean) => void }) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isValid, setIsValid] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Inputs</h2>
          <p className="text-sm text-gray-500">Default / Active / with info / valid</p>
        </div>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {visible && (
        <div className="space-y-6">
          {/* Default Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input
              type="text"
              placeholder="placeholder"
              className="w-full"
              style={{ height: "40px" }}
            />
          </div>

          {/* Active Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input
              type="text"
              placeholder="placeholder"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full"
              style={{
                height: "48px",
                borderColor: isFocused ? "var(--theme-primary)" : undefined,
                boxShadow: isFocused ? "0 0 0 2px rgba(var(--theme-primary-rgb), 0.2)" : undefined,
              }}
            />
          </div>

          {/* Input with Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input
              type="text"
              placeholder="placeholder"
              className="w-full"
              style={{ height: "40px" }}
            />
            <p className="text-xs text-gray-500 mt-1">Info text here</p>
          </div>

          {/* Valid Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="placeholder"
                value="Valid input"
                readOnly
                className="w-full pr-10"
                style={{
                  height: "48px",
                  borderColor: "#10b981",
                }}
              />
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
            </div>
          </div>

          {/* Width Variations */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">W 175</label>
              <Input
                type="text"
                placeholder="placeholder"
                className="w-[175px]"
                style={{ height: "40px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">W 360</label>
              <Input
                type="text"
                placeholder="placeholder"
                className="w-[360px]"
                style={{ height: "40px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">W Full</label>
              <Input
                type="text"
                placeholder="placeholder"
                className="w-full"
                style={{ height: "40px" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Pickers Showcase Component
function PickersShowcase({ visible, onToggle }: { visible: boolean; onToggle: (val: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Pickers</h2>
          <p className="text-sm text-gray-500">Date / Time / Color / Image / Country Code</p>
        </div>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {visible && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <Input
              type="date"
              className="w-full"
              style={{ height: "40px" }}
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <Input
              type="time"
              className="w-full"
              style={{ height: "40px" }}
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <Input
              type="color"
              className="w-full h-10"
              defaultValue="#8C5934"
            />
          </div>

          {/* Image Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <Input
              type="file"
              accept="image/*"
              className="w-full"
              style={{ height: "40px" }}
            />
          </div>

          {/* Country Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country Code</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              style={{ height: "40px" }}
            >
              <option>+1</option>
              <option>+44</option>
              <option>+91</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// Item Card Showcase Component
function ItemCardShowcase({ visible, onToggle }: { visible: boolean; onToggle: (val: boolean) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Item Card</h2>
          <p className="text-sm text-gray-500">Show Item / Hover</p>
        </div>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {visible && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Default Card */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
            <h3 className="font-semibold text-gray-900 mb-1">Item Title</h3>
            <p className="text-sm text-gray-600">Item description goes here</p>
            <p className="text-lg font-bold theme-text-primary mt-2">$99.99</p>
          </div>

          {/* Hover Card */}
          <div
            className="border border-gray-200 rounded-lg p-4 bg-white transition-all cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              boxShadow: isHovered ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
              transform: isHovered ? "translateY(-2px)" : "none",
            }}
          >
            <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
            <h3 className="font-semibold text-gray-900 mb-1">Item Title</h3>
            <p className="text-sm text-gray-600">Item description goes here</p>
            <p className="text-lg font-bold theme-text-primary mt-2">$99.99</p>
          </div>

          {/* Product Card with Theme */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white overflow-hidden group">
            <div className="w-full h-32 bg-gray-200 rounded mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Item Title</h3>
            <p className="text-sm text-gray-600">Item description goes here</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-bold theme-text-primary">$99.99</p>
              <button className="theme-button px-4 py-1 rounded-md text-sm">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Text Showcase Component
function TextShowcase({ visible, onToggle }: { visible: boolean; onToggle: (val: boolean) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Text</h2>
          <p className="text-sm text-gray-500">Typography and text styles</p>
        </div>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {visible && (
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold theme-heading mb-2">Heading 1</h1>
            <h2 className="text-3xl font-bold theme-heading mb-2">Heading 2</h2>
            <h3 className="text-2xl font-semibold theme-heading mb-2">Heading 3</h3>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Heading 4</h4>
            <p className="text-base text-gray-700 mb-2">Body text - Regular paragraph text</p>
            <p className="text-sm text-gray-600 mb-2">Small text - Secondary information</p>
            <p className="text-xs text-gray-500">Extra small text - Captions and labels</p>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-bold theme-text-primary">Theme Primary Color Text</p>
            <p className="text-lg font-bold" style={{ color: "var(--theme-dark)" }}>Theme Dark Color Text</p>
            <p className="text-base text-gray-900">Gray 900 Text</p>
            <p className="text-base text-gray-700">Gray 700 Text</p>
            <p className="text-base text-gray-600">Gray 600 Text</p>
            <p className="text-base text-gray-500">Gray 500 Text</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Sidebar Tabs Showcase Component
function SidebarTabsShowcase({ visible, onToggle }: { visible: boolean; onToggle: (val: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sidebar Tabs</h2>
          <p className="text-sm text-gray-500">Navigation tabs for sidebar</p>
        </div>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {visible && (
        <div className="flex gap-4">
          <div className="w-64 bg-gray-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="px-4 py-2 bg-theme-primary text-white rounded-md">Dashboard</div>
              <div className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md cursor-pointer">Orders</div>
              <div className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md cursor-pointer">Products</div>
              <div className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md cursor-pointer">Settings</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Options Menu Showcase Component
function OptionsMenuShowcase({ visible, onToggle }: { visible: boolean; onToggle: (val: boolean) => void }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Options Menu</h2>
          <p className="text-sm text-gray-500">Dropdown and context menus</p>
        </div>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {visible && (
        <div className="space-y-4 pb-12">
          <div ref={dropdownRef} className="relative inline-block z-10">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-black px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Options Menu {isDropdownOpen ? "▲" : "▼"}
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-48 z-50 text-black">
                <div className="py-1">
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Option 1
                  </div>
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Option 2
                  </div>
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Option 3
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Categories Showcase Component
function CategoriesShowcase({ visible, onToggle }: { visible: boolean; onToggle: (val: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500">Category display components</p>
        </div>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {visible && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Category 1", "Category 2", "Category 3", "Category 4"].map((cat, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 text-center hover:border-theme-primary transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">{cat}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Standards Section Component
function StandardsSection({ visible, onToggle }: { visible: boolean; onToggle: (val: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sp Standards Kit</h2>
          <p className="text-sm text-gray-500">Developer must follow the given standards</p>
        </div>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>
      {visible && (
        <div className="bg-theme-light/20 rounded-lg p-6 border border-theme-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-theme-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xl">⚙</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sp Standards Kit</h3>
              <p className="text-sm text-gray-600">Developer must follow the given standards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Sizes</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>4, 6, 8, 12, 16, 20, 24, 28, 40, 48</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Radius</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>sm: 6px</li>
                <li>md: 8px</li>
                <li>lg: 12px</li>
                <li>xl: 100px (full)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Inputs</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>H: 40px / 48px</li>
                <li>W: 175px / 360px / Full</li>
                <li>Title / Placeholder / Info / Validation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Buttons</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Width: 100px / 175px / 360px</li>
                <li>Style: Outline / Fill / Hover</li>
                <li>Rounded: 6px / 10px / full</li>
                <li>Text: size 18px, color white</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

