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
};

export default function FAQs() {
const [content, setContent] = useState<FAQContent>({
  faqs: [],
});
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First FAQ expanded by default

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getContentByType("faqs");
        setContent({
  faqs: data.faqs ?? [],
});
        // Expand first FAQ if available
        if (data.faqs && data.faqs.length > 0) {
          setExpandedIndex(0);
        }
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

  return (
    <div className="min-h-screen bg-white py-20">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title - Centered */}
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--theme-primary)" }}>
            Frequently Asked Questions
          </h1>
          
          {/* Subtitle - Centered */}
          <p className="text-lg text-gray-600 mt-2">
            Legal page details
          </p>
        </div>

        {/* HR Line */}
        <hr className="my-8 border-t border-gray-400" style={{ borderWidth: "1px" }} />

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
                      className="max-w-none text-gray-700 content-page"
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
      </main>
      <Footer />
    </div>
  );
}

