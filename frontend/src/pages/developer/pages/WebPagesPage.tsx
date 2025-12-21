import React, { useState, useEffect } from "react";
import { FileText, Plus, X } from "lucide-react";
import {
  getWebPages,
  createWebPage,
  updateWebPage,
  deleteWebPage,
} from "@/api/webpage.api";

interface WebPage {
  _id: string;
  title: string;
  slug: string;
  enabled: boolean;
  subInfo: string;
  order: number;
}

export default function WebPagesPage() {
  const [pages, setPages] = useState<WebPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    subInfo: "",
    enabled: true,
  });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const data = await getWebPages();
      setPages(data);
    } catch (error) {
      console.error("Failed to load pages:", error);
    }
  };

  const togglePage = async (id: string, enabled: boolean) => {
    try {
      await updateWebPage(id, { enabled: !enabled });
      await loadPages();
    } catch (error) {
      console.error("Failed to toggle page:", error);
    }
  };

  const handleAddPage = async () => {
    if (!newPage.title || !newPage.slug) {
      alert("Please fill in title and slug");
      return;
    }

    setIsLoading(true);
    try {
      await createWebPage(newPage);
      await loadPages();
      setShowAddModal(false);
      setNewPage({ title: "", slug: "", subInfo: "", enabled: true });
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create page");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      await deleteWebPage(id);
      await loadPages();
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Web Pages</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#A8734B] hover:bg-[#8B5E3C] text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add Page
        </button>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#A8734B]" />
          <h2 className="font-semibold text-gray-900">All Pages</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {pages.map((page) => (
            <div
              key={page._id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{page.title}</h3>
                <p className="text-sm text-gray-500">{page.subInfo || "sub info here"}</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Toggle Switch */}
                <button
                  onClick={() => togglePage(page._id, page.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    page.enabled ? "bg-[#A8734B]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      page.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>

                <button
                  onClick={() => handleDelete(page._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Page Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Page</h3>
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
                  Title
                </label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8734B] focus:border-[#A8734B] outline-none"
                  placeholder="Page Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8734B] focus:border-[#A8734B] outline-none"
                  placeholder="/page-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Info
                </label>
                <input
                  type="text"
                  value={newPage.subInfo}
                  onChange={(e) => setNewPage({ ...newPage, subInfo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8734B] focus:border-[#A8734B] outline-none"
                  placeholder="Sub info here"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newPage.enabled}
                  onChange={(e) => setNewPage({ ...newPage, enabled: e.target.checked })}
                  className="w-4 h-4 text-[#A8734B] border-gray-300 rounded focus:ring-[#A8734B]"
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
                  onClick={handleAddPage}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-[#A8734B] hover:bg-[#8B5E3C] text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Adding..." : "Add Page"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
