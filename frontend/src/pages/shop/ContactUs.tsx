import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createQuery } from "@/api/query.api";
import { useToast } from "@/components/ui/toast";

export default function ContactUs() {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.subject || !formData.description) {
      error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await createQuery(formData);
      success("Your query has been submitted successfully!");
      setFormData({ email: "", subject: "", description: "" });
    } catch (err: any) {
      error(err?.response?.data?.message || "Failed to submit query. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: "var(--theme-primary)" }}>
          Contact Us
        </h1>

        {/* Main Content Card */}
        <div className="bg-[#E8D4C4] rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section - Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--theme-dark)" }}>
                You have any query!
              </h2>
              <p className="text-gray-700 mb-6">Fill the form to send us.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter here"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Enter here"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter here"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-white font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = "var(--theme-dark)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = "var(--theme-primary)";
                    }
                  }}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>

            {/* Right Section - Logo */}
            <div className="flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full max-w-md h-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}




