import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getContentByType } from "@/api/content.api";
import { TableOfContents } from "@/components/ui/TableOfContents";
import PageLoader from "@/components/ui/PageLoader";
type PageContent = {
  title: string;
  subTitle: string;
  description: string;
  lastUpdated?: string;
};

export default function PrivacyPolicy() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<PageContent>({
    title: "Privacy Policy",
    subTitle: "Legal page details",
    description: "",
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getContentByType("privacy");
        setContent(data);
      } catch (err) {
        console.error("Failed to load privacy policy", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Add IDs to headings in the content after it's rendered
  useEffect(() => {
    if (!contentRef.current || !content.description || loading) return;

    const headings = contentRef.current.querySelectorAll("h1, h2, h3, h4");
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const text = heading.textContent?.trim() || "";
        const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        heading.id = id;
      }
    });
  }, [content.description, loading]);

  if (loading) return <PageLoader message="Loading Privacy Policy..." />;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "15 Nov 2023";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title - Centered */}
          <div className="text-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--theme-primary)" }}>
              {content.title || "Privacy Policy"}
            </h1>
            
            {/* Subtitle - Centered */}
            <p className="text-lg text-gray-500 mt-2">
              {content.subTitle || "Legal page details"}
            </p>
          </div>

          {/* HR Line - Full Width */}
          <hr className="my-8 border-t border-gray-300" style={{ borderWidth: "1px" }} />

          {/* Two Column Layout - Table of Contents and Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Left Sidebar */}
            <div className="lg:col-span-1">
              {content.description && (
                <TableOfContents htmlContent={content.description} contentRef={contentRef} />
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Content - Preserves formatting */}
              <div 
                ref={contentRef}
                className="max-w-none text-gray-700 mb-8 content-page"
                dangerouslySetInnerHTML={{ __html: content.description || "<p>No content available yet.</p>" }}
              />

              {/* Last Updated */}
              <div className="flex justify-end mt-12">
                <div className="text-sm text-gray-700">
                  Last updated {formatDate(content.lastUpdated)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

