import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createQuery } from "@/api/query.api";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
      success("Your message has been sent successfully!");
      setFormData({ email: "", subject: "", description: "" });
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#A8734B] mb-4">
              Contact Us
            </h1>
            <p className="text-gray-600 mb-8">
              Have a question or need assistance? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            {/* Contact Form */}
            <div 
              className="rounded-lg p-8 shadow-md"
              style={{ backgroundColor: "var(--theme-accent)" }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <Input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <Textarea
                    name="description"
                    placeholder="Your Message"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full theme-button text-white"
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
