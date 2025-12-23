import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getContentByType } from "@/api/content.api";
import { TableOfContents } from "@/components/ui/TableOfContents";
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
    subTitle: "Legal page related Sub Title",
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

  if (loading) return <div>Loading...</div>;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "15 Nov 2023";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Left Sidebar */}
          <div className="lg:col-span-1">
            {content.description && (
              <TableOfContents htmlContent={content.description} contentRef={contentRef} />
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#A8734B] mb-4">
              {content.title || "Privacy Policy"}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-gray-600 mb-8">
              {content.subTitle || "Legal page related Sub Title"}
            </p>

            {/* Content */}
            <div 
              ref={contentRef}
              className="prose prose-lg max-w-none text-gray-700 mb-8"
              dangerouslySetInnerHTML={{ __html: content.description || "<p>No content available yet.</p>" }}
            />

            {/* Last Updated */}
            <div className="text-right text-sm text-gray-500 mt-12">
              Last updated {formatDate(content.lastUpdated)}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

