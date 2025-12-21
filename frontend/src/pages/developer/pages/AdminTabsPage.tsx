import React, { useState, useEffect } from "react";
import { LayoutDashboard, Plus, X } from "lucide-react";
import {
  getAdminTabs,
  createAdminTab,
  updateAdminTab,
  deleteAdminTab,
} from "@/api/admintab.api";
import IconPicker from "@/components/developer/IconPicker";

interface AdminTab {
  _id: string;
  label: string;
  path: string;
  icon: string;
  enabled: boolean;
  subInfo: string;
  order: number;
}

export default function AdminTabsPage() {
  const [tabs, setTabs] = useState<AdminTab[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTab, setNewTab] = useState({
    label: "",
    path: "",
    icon: "",
    subInfo: "",
    enabled: true,
  });

  useEffect(() => {
    loadTabs();
  }, []);

  const loadTabs = async () => {
    try {
      const data = await getAdminTabs();
      setTabs(data);
    } catch (error) {
      console.error("Failed to load tabs:", error);
    }
  };

  const toggleTab = async (id: string, enabled: boolean) => {
    try {
      await updateAdminTab(id, { enabled: !enabled });
      await loadTabs();
    } catch (error) {
      console.error("Failed to toggle tab:", error);
    }
  };

  const handleAddTab = async () => {
    if (!newTab.label || !newTab.path) {
      alert("Please fill in label and path");
      return;
    }

    setIsLoading(true);
    try {
      await createAdminTab(newTab);
      await loadTabs();
      setShowAddModal(false);
      setNewTab({ label: "", path: "", icon: "", subInfo: "", enabled: true });
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create tab");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tab?")) return;
    try {
      await deleteAdminTab(id);
      await loadTabs();
    } catch (error) {
      console.error("Failed to delete tab:", error);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold theme-heading">Admin Tabs</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors theme-button"
        >
          <Plus size={18} />
          Add Page
        </button>
      </div>

      {/* Tabs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <LayoutDashboard className="w-5 h-5 theme-text-primary" />
          <h2 className="font-semibold theme-heading">All Admin Tabs</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {tabs.map((tab) => (
            <div
              key={tab._id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{tab.label}</h3>
                <p className="text-sm text-gray-500">{tab.subInfo || "sub info here"}</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Toggle Switch */}
                <button
                  onClick={() => toggleTab(tab._id, tab.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    tab.enabled ? "" : "bg-gray-300"
                  }`}
                  style={tab.enabled ? { backgroundColor: "var(--theme-primary)" } : {}}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      tab.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>

                <button
                  onClick={() => handleDelete(tab._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Tab Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Tab</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={newTab.label}
                  onChange={(e) => setNewTab({ ...newTab, label: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none"
                  style={{
                    "--tw-ring-color": "var(--theme-primary)",
                  } as React.CSSProperties & { "--tw-ring-color": string }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--theme-primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 2px var(--theme-primary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                  placeholder="Tab Label"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Path
                </label>
                <input
                  type="text"
                  value={newTab.path}
                  onChange={(e) => setNewTab({ ...newTab, path: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none"
                  style={{
                    "--tw-ring-color": "var(--theme-primary)",
                  } as React.CSSProperties & { "--tw-ring-color": string }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--theme-primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 2px var(--theme-primary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                  placeholder="/admin/path"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Info
                </label>
                <input
                  type="text"
                  value={newTab.subInfo}
                  onChange={(e) => setNewTab({ ...newTab, subInfo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none"
                  style={{
                    "--tw-ring-color": "var(--theme-primary)",
                  } as React.CSSProperties & { "--tw-ring-color": string }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--theme-primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 2px var(--theme-primary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                  placeholder="Sub info here"
                />
              </div>

              <IconPicker
                value={newTab.icon}
                onChange={(iconName) => setNewTab({ ...newTab, icon: iconName })}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newTab.enabled}
                  onChange={(e) => setNewTab({ ...newTab, enabled: e.target.checked })}
                  className="w-4 h-4 border-gray-300 rounded"
                  style={{ accentColor: "var(--theme-primary)" }}
                />
                <label className="text-sm text-gray-700">Enabled</label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTab}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 theme-button"
                >
                  {isLoading ? "Adding..." : "Add Tab"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
