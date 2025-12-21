import React, { useState, useEffect } from "react";
import { PanelBottom, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { getFooter, updateFooter } from "@/api/footer.api";

interface FooterLink {
  label: string;
  url: string;
  order: number;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
  order: number;
}

export default function FooterPage() {
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

  useEffect(() => {
    loadFooter();
  }, []);

  const loadFooter = async () => {
    try {
      const data = await getFooter();
      setFooter(data);
    } catch (error) {
      console.error("Failed to load footer:", error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateFooter(footer);
      alert("Footer settings saved successfully!");
    } catch (error) {
      console.error("Failed to save footer:", error);
      alert("Failed to save footer settings");
    } finally {
      setIsLoading(false);
    }
  };

  const addSection = () => {
    setFooter({
      ...footer,
      sections: [
        ...footer.sections,
        {
          title: "Quick Links",
          links: [],
          order: footer.sections.length,
        },
      ],
    });
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

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold theme-heading">Footer</h1>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 theme-button"
        >
          <Save size={18} />
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Footer Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {footer.sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(sectionIndex, "title", e.target.value)}
                className="font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
              />
              <button
                onClick={() => removeSection(sectionIndex)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {section.links.map((link, linkIndex) => (
                <div key={linkIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink(sectionIndex, linkIndex, "label", e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded outline-none"
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
                    className="p-1 text-gray-400 hover:text-red-500"
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
          onClick={addSection}
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
              {footer.sections.map((section, index) => (
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
  );
}
