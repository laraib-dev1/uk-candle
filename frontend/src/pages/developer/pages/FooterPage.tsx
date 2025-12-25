import React, { useState, useEffect, useMemo } from "react";
import { PanelBottom, Save, Plus, Trash2, GripVertical, X } from "lucide-react";
import { getFooter, updateFooter } from "@/api/footer.api";
import { getEnabledWebPagesByLocation } from "@/api/webpage.api";
import { useToast } from "@/components/ui/toast";
import PageLoader from "@/components/ui/PageLoader";

interface FooterLink {
  label: string;
  url: string;
  order: number;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
  order: number;
  enabled?: boolean;
}

export default function FooterPage() {
  const { success, error } = useToast();
  const [footer, setFooter] = useState<{
    sections: FooterSection[];
    socialLinks: Record<string, string>;
    copyright: string;
    description: string;
    showPreview: boolean;
  }>({
    sections: [],
    socialLinks: {},
    copyright: "",
    description: "",
    showPreview: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pages, setPages] = useState<{ _id: string; title: string; slug: string }[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSectionEnabled, setNewSectionEnabled] = useState(true);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(new Set());

  const loadFooter = async () => {
    try {
      const data = await getFooter();
      let sections = data.sections || [];
      
      // If no sections exist, auto-create from footer web pages
      if (sections.length === 0) {
        const footerPages = await getEnabledWebPagesByLocation("footer");
        if (footerPages && footerPages.length > 0) {
          // Create one section with all footer pages
          sections = [{
            title: "Quick Links",
            links: footerPages.map((p: any, idx: number) => ({
              label: p.title,
              url: p.slug.startsWith("/") ? p.slug : `/${p.slug}`,
              order: idx,
            })),
            order: 0,
            enabled: true,
          }];
          
          // Save the auto-created section (preserve existing showPreview value)
          try {
            await updateFooter({
              ...data,
              sections,
              showPreview: data.showPreview !== false, // Preserve existing value or default to true
            });
          } catch (e) {
            console.error("Failed to auto-create footer sections:", e);
          }
        }
      }
      
      // Debug: log the showPreview value from backend
      console.log("Footer data from backend:", data);
      console.log("showPreview value:", data.showPreview, "type:", typeof data.showPreview);
      
      setFooter({
        ...data,
        sections: sections.map((s: FooterSection) => ({
          ...s,
          enabled: s.enabled !== false,
        })),
        // Use the exact value from backend - handle string "false" as well
        showPreview: data.showPreview === undefined || data.showPreview === null 
          ? true 
          : (data.showPreview === true || data.showPreview === "true"),
      });
    } catch (error) {
      console.error("Failed to load footer:", error);
    }
  };

  const loadPages = async () => {
    try {
      const data = await getEnabledWebPagesByLocation("footer");
      setPages(data || []);
    } catch (err) {
      console.error("Failed to load footer pages:", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setInitialLoading(true);
      try {
        await Promise.all([loadFooter(), loadPages()]);
      } finally {
        setInitialLoading(false);
      }
    };
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Debug: log what we're saving
      console.log("Saving footer with showPreview:", footer.showPreview, "type:", typeof footer.showPreview);
      
      // Explicitly include showPreview - convert to boolean explicitly
      const showPreviewValue = footer.showPreview === true || (typeof footer.showPreview === "string" && footer.showPreview === "true") || (typeof footer.showPreview === "number" && footer.showPreview === 1);
      
      const saveData = {
        sections: footer.sections,
        socialLinks: footer.socialLinks,
        copyright: footer.copyright,
        description: footer.description,
        showPreview: showPreviewValue, // Explicitly set as boolean
      };
      
      console.log("Sending to backend - showPreview:", showPreviewValue, "full data:", JSON.stringify(saveData));
      const result = await updateFooter(saveData);
      console.log("Backend response:", result);
      
      success("Footer settings saved successfully!");
      
      // Reload to verify it was saved
      await loadFooter();
    } catch (err) {
      console.error("Failed to save footer:", err);
      error("Failed to save footer settings");
    } finally {
      setIsLoading(false);
    }
  };

  const addSectionFromSelection = () => {
    if (selectedPageIds.size === 0) {
      error("Select at least one page");
      return;
    }
    if (!newSectionTitle.trim()) {
      error("Please enter a group name");
      return;
    }
    const newLinks = pages
      .filter((p) => selectedPageIds.has(p._id))
      .map((p, idx) => ({
        label: p.title,
        url: p.slug.startsWith("/") ? p.slug : `/${p.slug}`,
        order: idx,
      }));

    setFooter((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: newSectionTitle.trim(),
          links: newLinks,
          order: prev.sections.length,
          enabled: newSectionEnabled,
        },
      ],
    }));
    setSelectedPageIds(new Set());
    setNewSectionEnabled(true);
    setNewSectionTitle("");
    setShowAddModal(false);
  };

  const updateSection = (index: number, field: string, value: any) => {
    const newSections = [...footer.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setFooter({ ...footer, sections: newSections });
  };

  const addLinkToSection = (sectionIndex: number) => {
    const newSections = [...footer.sections];
    newSections[sectionIndex].links.push({
      label: "Page 1",
      url: "/",
      order: newSections[sectionIndex].links.length,
    });
    setFooter({ ...footer, sections: newSections });
  };

  const updateLink = (sectionIndex: number, linkIndex: number, field: string, value: string) => {
    const newSections = [...footer.sections];
    newSections[sectionIndex].links[linkIndex] = {
      ...newSections[sectionIndex].links[linkIndex],
      [field]: value,
    };
    setFooter({ ...footer, sections: newSections });
  };

  const removeLink = (sectionIndex: number, linkIndex: number) => {
    const newSections = [...footer.sections];
    newSections[sectionIndex].links.splice(linkIndex, 1);
    setFooter({ ...footer, sections: newSections });
  };

  const removeSection = (index: number) => {
    const newSections = footer.sections.filter((_, i) => i !== index);
    setFooter({ ...footer, sections: newSections });
  };

  const toggleSectionEnabled = (index: number) => {
    const newSections = [...footer.sections];
    newSections[index] = { ...newSections[index], enabled: newSections[index].enabled === false ? true : false };
    setFooter({ ...footer, sections: newSections });
  };

  const normalizeSlug = (url: string) => {
    if (!url) return "";
    try {
      // strip domain if absolute
      const u = new URL(url, "http://placeholder");
      return u.pathname.replace(/\/+$/, "") || "/";
    } catch {
      return url.replace(/\/+$/, "") || "/";
    }
  };

  const usedPageIds = useMemo(() => {
    return new Set<string>(
      footer.sections.flatMap((section) =>
        section.links
          .map((link) => {
            const linkPath = normalizeSlug(link.url);
            const match = pages.find((p) => {
              const pagePath = normalizeSlug(p.slug.startsWith("/") ? p.slug : `/${p.slug}`);
              return pagePath === linkPath;
            });
            return match?._id || "";
          })
          .filter(Boolean)
      )
    );
  }, [footer.sections, pages]);

  useEffect(() => {
    if (showAddModal) {
      setSelectedPageIds(new Set());
      setNewSectionEnabled(true);
      setNewSectionTitle("");
    }
  }, [showAddModal]);

  if (initialLoading) {
    return <PageLoader message="Loading footer settings..." />;
  }

  return (
    <>
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold theme-heading">Footer</h1>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 theme-button"
        >
          {isLoading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* Footer Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {footer.sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-2 min-w-0">
              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab flex-shrink-0" />
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(sectionIndex, "title", e.target.value)}
                className="font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 flex-1 min-w-0"
              />
              <label className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={section.enabled !== false}
                  onChange={() => toggleSectionEnabled(sectionIndex)}
                  className="w-4 h-4 border-gray-300 rounded"
                  style={{ accentColor: "var(--theme-primary)" }}
                />
                <span>Show</span>
              </label>
              <button
                onClick={() => removeSection(sectionIndex)}
                className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {section.links.map((link, linkIndex) => (
                <div key={linkIndex} className="flex items-center gap-2 min-w-0">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink(sectionIndex, linkIndex, "label", e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded outline-none min-w-0"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--theme-primary)";
                      e.currentTarget.style.boxShadow = "0 0 0 1px var(--theme-primary)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                    placeholder="Link label"
                  />
                  <button
                    onClick={() => removeLink(sectionIndex, linkIndex)}
                    className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {section.links.length === 0 && (
                <p className="text-sm text-gray-400">No links yet</p>
              )}
              <button
                onClick={() => addLinkToSection(sectionIndex)}
                className="flex items-center gap-1 text-sm font-medium mt-2"
                style={{ color: "var(--theme-primary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--theme-dark)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--theme-primary)";
                }}
              >
                <Plus size={16} />
                Add Link
              </button>
            </div>
          </div>
        ))}

        {/* Add Section Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-colors"
          style={{ borderColor: "border-gray-300" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--theme-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        >
          <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Add Section</p>
        </button>
      </div>

      {/* Footer Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold theme-heading">Footer Preview</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={footer.showPreview}
              onChange={(e) => setFooter({ ...footer, showPreview: e.target.checked })}
              className="w-4 h-4 border-gray-300 rounded"
              style={{ accentColor: "var(--theme-primary)" }}
            />
            <span className="text-sm text-gray-700">Show Footer Preview</span>
          </label>
        </div>
        {footer.showPreview && (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              {footer.sections.filter((s) => s.enabled !== false).slice(0,3).map((section, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.url}
                          className="text-sm text-gray-600 transition-colors"
                          style={{ color: "inherit" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "var(--theme-primary)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "";
                          }}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Footer Column</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newSectionEnabled}
                  onChange={(e) => setNewSectionEnabled(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded"
                  style={{ accentColor: "var(--theme-primary)" }}
                />
                <span className="text-sm text-gray-700">Show this column</span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Enter group name (e.g., Quick Links, Support, etc.)"
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--theme-primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 2px rgba(var(--theme-primary-rgb), 0.2)";
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.value.trim()) {
                      e.currentTarget.style.borderColor = "#ef4444";
                    } else {
                      e.currentTarget.style.borderColor = "";
                    }
                    e.currentTarget.style.boxShadow = "";
                  }}
                  autoFocus
                />
                {!newSectionTitle.trim() && (
                  <p className="text-xs text-red-500 mt-1">Group name is required</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Choose pages to include</h4>
                <div className="border border-gray-200 rounded-lg p-3 space-y-2 max-h-60 overflow-y-auto">
                  {pages.map((page) => {
                    const disabled = usedPageIds.has(page._id);
                    const checked = selectedPageIds.has(page._id);
                    return (
                      <label
                        key={page._id}
                        className={`flex items-center gap-2 text-sm ${disabled ? "text-gray-400" : "text-gray-800"}`}
                      >
                        <input
                          type="checkbox"
                          disabled={disabled}
                          checked={checked}
                          onChange={(e) => {
                            const next = new Set(selectedPageIds);
                            if (e.target.checked) next.add(page._id);
                            else next.delete(page._id);
                            setSelectedPageIds(next);
                          }}
                          className="w-4 h-4 border-gray-300 rounded"
                          style={{ accentColor: "var(--theme-primary)" }}
                        />
                        <span>{page.title}</span>
                        {disabled && <span className="text-xs text-gray-400">(already in another column)</span>}
                      </label>
                    );
                  })}
                  {pages.length === 0 && <p className="text-sm text-gray-500">No pages available.</p>}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addSectionFromSelection}
                  className="px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2 theme-button"
                >
                  <Plus size={16} />
                  Add Column
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
