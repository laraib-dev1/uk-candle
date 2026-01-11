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

export default function TermsConditions() {
  const [content, setContent] = useState<PageContent>({
    title: "Terms & Conditions",
    subTitle: "Legal page related Sub Title",
    description: "",
    lastUpdated: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getContentByType("terms");
        setContent(data);
      } catch (err) {
        console.error("Failed to load terms & conditions", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Preserve alignment styles after content loads
  useEffect(() => {
    if (contentRef.current && content.description) {
      const elements = contentRef.current.querySelectorAll('[style*="text-align"]');
      elements.forEach((el) => {
        const style = el.getAttribute('style');
        if (style) {
          const match = style.match(/text-align:\s*(center|right|justify|left)/i);
          if (match) {
            (el as HTMLElement).style.textAlign = match[1] as any;
          }
        }
      });
    }
  }, [content.description]);

  if (loading) return <PageLoader message="GraceByAnu" />;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "15 Nov 2023";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        /* Force text-align from inline styles - override any other rules */
        .content-area p[style*="text-align"],
        .content-area div[style*="text-align"],
        .content-area h1[style*="text-align"],
        .content-area h2[style*="text-align"],
        .content-area h3[style*="text-align"],
        .content-area h4[style*="text-align"],
        .content-area h5[style*="text-align"],
        .content-area h6[style*="text-align"],
        .content-area span[style*="text-align"],
        .content-area [style*="text-align"] {
          text-align: inherit !important;
        }
        .content-area [style*="text-align: center"],
        .content-area [style*="text-align:center"],
        .content-area [style*="text-align: center;"],
        .content-area [style*="text-align:center;"] {
          text-align: center !important;
        }
        .content-area [style*="text-align: right"],
        .content-area [style*="text-align:right"],
        .content-area [style*="text-align: right;"],
        .content-area [style*="text-align:right;"] {
          text-align: right !important;
        }
        .content-area [style*="text-align: justify"],
        .content-area [style*="text-align:justify"],
        .content-area [style*="text-align: justify;"],
        .content-area [style*="text-align:justify;"] {
          text-align: justify !important;
        }
        .content-area [style*="text-align: left"],
        .content-area [style*="text-align:left"],
        .content-area [style*="text-align: left;"],
        .content-area [style*="text-align:left;"] {
          text-align: left !important;
        }
      `}</style>
      <Navbar />
      {/* Title Section - Full width container */}
      <div className="w-full">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-0">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold theme-heading mb-4 text-center">
            {content.title || "Terms & Conditions"}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-0 text-center">
            {content.subTitle || "Legal page related Sub Title"}
          </p>
        </div>

        {/* Divider - Full Width, no gap */}
        <div className="w-full h-px bg-gray-300"></div>
      </div>

      {/* Content Section - Inner area like landing page */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Left Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <TableOfContents htmlContent={content.description} contentRef={contentRef} />
          </div>

          {/* Main Content - Consistent content area */}
          <div className="flex-1">
            {/* Content */}
            <div 
              ref={contentRef}
              className="prose prose-lg max-w-none text-gray-700 mb-8 relative content-area"
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

