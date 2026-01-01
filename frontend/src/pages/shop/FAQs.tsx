import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getContentByType } from "@/api/content.api";
import { ChevronDown, ChevronRight } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQContent = {
  faqs?: FAQItem[];
  lastUpdated?: string;
};

export default function FAQs() {
  const [content, setContent] = useState<FAQContent>({
    faqs: [],
  });
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // All collapsed by default

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getContentByType("faqs");
        setContent({
          faqs: data.faqs ?? [],
          lastUpdated: data.lastUpdated,
        });
      } catch (err) {
        console.error("Failed to load FAQs", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "15 Nov 2023";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-white py-20 pb-0">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold theme-heading mb-12">
          Frequently Asked Questions
        </h1>

        {/* FAQs List */}
        <div className="space-y-4">
          {content.faqs && content.faqs.length > 0 ? (
            content.faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question || "Question Here Lorem ipsum dolor sit amet."}
                  </span>
                  {expandedIndex === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-600 shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600 shrink-0" />
                  )}
                </button>

                {/* Answer Content */}
                {expandedIndex === index && (
                  <div className="px-6 pb-6 pt-0">
                    <div
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: faq.answer || "<p>No answer available.</p>" }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No FAQs available yet. Please check back later.
            </p>
          )}
        </div>

        {/* Last Updated - Bottom Right */}
        {content.lastUpdated && (
          <div className="text-right text-sm text-gray-500 mt-12">
            Updated: {formatDate(content.lastUpdated)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

