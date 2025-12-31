import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getContentByType } from "@/api/content.api";
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#A8734B] mb-4">
          {content.title || "Terms & Conditions"}
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-8">
          {content.subTitle || "Legal page related Sub Title"}
        </p>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none text-gray-700 mb-8"
          dangerouslySetInnerHTML={{ __html: content.description || "<p>No content available yet.</p>" }}
        />

        {/* Last Updated */}
        <div className="text-right text-sm text-gray-500 mt-12">
          Last updated {formatDate(content.lastUpdated)}
        </div>
      </main>
      <Footer />
    </div>
  );
}

