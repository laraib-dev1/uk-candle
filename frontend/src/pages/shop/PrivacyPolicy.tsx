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
  const [content, setContent] = useState<PageContent>({
    title: "Privacy Policy",
    subTitle: "Legal page related Sub Title",
    description: "",
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

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

  if (loading) return <PageLoader message="GraceByAnu" />;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "15 Nov 2023";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold theme-heading mb-4 text-center">
          {content.title || "Privacy Policy"}
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-6 text-center">
          {content.subTitle || "Legal page related Sub Title"}
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-300 mb-8"></div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Left Sidebar - Below divider */}
          <div className="lg:w-64 flex-shrink-0">
            <TableOfContents htmlContent={content.description} contentRef={contentRef} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Content */}
            <div 
              ref={contentRef}
              className="prose prose-lg max-w-none text-gray-700 mb-8 relative"
              style={{ 
                textAlign: 'inherit'
              }}
              dangerouslySetInnerHTML={{ __html: content.description || "<p>No content available yet.</p>" }}
            />

            {/* Last Updated - Bottom Right */}
            <div className="text-right text-sm text-gray-500 mt-12">
              Updated: {formatDate(content.lastUpdated)}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

