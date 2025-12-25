import React, { useState, useEffect } from "react";
import { LayoutDashboard, Plus, X } from "lucide-react";
import {
  getAdminTabs,
  createAdminTab,
  updateAdminTab,
  deleteAdminTab,
} from "@/api/admintab.api";
import IconPicker from "@/components/developer/IconPicker";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import PageLoader from "@/components/ui/PageLoader";

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
  const { success, error } = useToast();
  const [tabs, setTabs] = useState<AdminTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<Record<string, boolean>>({});
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>({});
  const [newTab, setNewTab] = useState({
    label: "",
    path: "",
    icon: "",
    subInfo: "",
    enabled: true,
  });
  const [tabErrors, setTabErrors] = useState<{ label?: string; path?: string }>({});

  useEffect(() => {
    loadTabs();
  }, []);

  const loadTabs = async () => {
    setLoading(true);
    try {
      const data = await getAdminTabs();
      setTabs(data);
    } catch (error) {
      console.error("Failed to load tabs:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTab = async (id: string, enabled: boolean) => {
    if (toggleLoading[id]) return;
    setToggleLoading(prev => ({ ...prev, [id]: true }));
    try {
      await updateAdminTab(id, { enabled: !enabled });
      await loadTabs();
    } catch (error) {
      console.error("Failed to toggle tab:", error);
    } finally {
      setToggleLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleAddTab = async () => {
    const errors: { label?: string; path?: string } = {};
    
    if (!newTab.label.trim()) {
      errors.label = "Label is required";
    }
    if (!newTab.path.trim()) {
      errors.path = "Path is required";
    } else if (!/^\/[a-z0-9/-]+$/.test(newTab.path)) {
      errors.path = "Path must start with / and contain only lowercase letters, numbers, and hyphens";
    }
    
    setTabErrors(errors);
    if (Object.keys(errors).length > 0) {
      error("Please fill in all required fields correctly.");
      return;
    }

    setIsLoading(true);
    try {
      await createAdminTab(newTab);
      success("Tab created successfully!");
      await loadTabs();
      setShowAddModal(false);
      setNewTab({ label: "", path: "", icon: "", subInfo: "", enabled: true });
      setTabErrors({});
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to create tab");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tab?")) return;
    if (deleteLoading[id]) return;
    setDeleteLoading(prev => ({ ...prev, [id]: true }));
    try {
      await deleteAdminTab(id);
      await loadTabs();
    } catch (error) {
      console.error("Failed to delete tab:", error);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return <PageLoader message="Loading admin tabs..." />;
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold theme-heading">Admin Tabs</h1>
        {/* Add Button - Commented Out */}
        {/* <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors theme-button"
        >
          <Plus size={18} />
          Add Page
        </button> */}
      </div>

      {/* Tabs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <LayoutDashboard className="w-5 h-5 theme-text-primary" />
          <h2 className="font-semibold theme-heading">All Admin Tabs</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center justify-between px-6 py-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-11 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))
          ) : (
            tabs.map((tab) => (
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
                  disabled={toggleLoading[tab._id]}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    tab.enabled ? "" : "bg-gray-300"
                  }`}
                  style={tab.enabled ? { backgroundColor: "var(--theme-primary)" } : {}}
                >
                  {toggleLoading[tab._id] ? (
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        tab.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  )}
                </button>

                <button
                  onClick={() => handleDelete(tab._id)}
                  disabled={deleteLoading[tab._id]}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {deleteLoading[tab._id] ? (
                    <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <X size={18} />
                  )}
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Add Tab Modal - Commented Out */}
      {/* {showAddModal && (
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
                  Label *
                </label>
                <input
                  type="text"
                  value={newTab.label}
                  onChange={(e) => {
                    setNewTab({ ...newTab, label: e.target.value });
                    if (tabErrors.label) setTabErrors(prev => ({ ...prev, label: undefined }));
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg outline-none ${tabErrors.label ? "border-red-500" : "border-gray-300"}`}
                  style={{
                    "--tw-ring-color": "var(--theme-primary)",
                  } as React.CSSProperties & { "--tw-ring-color": string }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--theme-primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 2px var(--theme-primary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = tabErrors.label ? "" : "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                  placeholder="Tab Label"
                />
                {tabErrors.label && <p className="text-red-500 text-xs mt-1">{tabErrors.label}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Path *
                </label>
                <input
                  type="text"
                  value={newTab.path}
                  onChange={(e) => {
                    setNewTab({ ...newTab, path: e.target.value });
                    if (tabErrors.path) setTabErrors(prev => ({ ...prev, path: undefined }));
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg outline-none ${tabErrors.path ? "border-red-500" : "border-gray-300"}`}
                  style={{
                    "--tw-ring-color": "var(--theme-primary)",
                  } as React.CSSProperties & { "--tw-ring-color": string }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--theme-primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 2px var(--theme-primary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = tabErrors.path ? "" : "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                  placeholder="/admin/path"
                />
                {tabErrors.path && <p className="text-red-500 text-xs mt-1">{tabErrors.path}</p>}
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
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 theme-button flex items-center justify-center gap-2"
                >
                  {isLoading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                  Add Tab
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
