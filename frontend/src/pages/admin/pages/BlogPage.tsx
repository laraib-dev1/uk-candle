import React, { useState } from "react";
import FilterTabs from "@/components/ui/FilterTabs";
import BlogsTab from "@/components/admin/blog/BlogsTab";
import BlogCategoriesTab from "@/components/admin/blog/BlogCategoriesTab";
import BlogAuthorsTab from "@/components/admin/blog/BlogAuthorsTab";
import BlogAuthorProfileTab from "@/components/admin/blog/BlogAuthorProfileTab";

type TabType = "blogs" | "categories" | "authors" | "author-profile";

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<TabType>("blogs");
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);

  const tabs = [
    { id: "blogs", label: "Blogs" },
    { id: "categories", label: "Categories" },
    { id: "authors", label: "Authors" },
    { id: "author-profile", label: "Author Profile" },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4 md:p-6 overflow-visible">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-0">
        <h2 className="text-2xl font-semibold theme-heading" style={{ color: "var(--theme-primary)" }}>
          Blogging
        </h2>
        <FilterTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabType)}
        />
      </div>

      <div className="mt-6">
        {activeTab === "blogs" && <BlogsTab />}
        {activeTab === "categories" && <BlogCategoriesTab />}
        {activeTab === "authors" && (
          <BlogAuthorsTab
            onAuthorSelect={(authorId) => {
              setSelectedAuthorId(authorId);
              setActiveTab("author-profile");
            }}
          />
        )}
        {activeTab === "author-profile" && (
          <BlogAuthorProfileTab authorId={selectedAuthorId} />
        )}
      </div>
    </div>
  );
}
