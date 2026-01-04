import React, { useState, useEffect } from "react";
import { Code2 } from "lucide-react";
import DeveloperKeyModal from "../../../components/developer/DeveloperKeyModal";
import PageLoader from "@/components/ui/PageLoader";

export default function SpConsolePage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for SP Console
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader message="GraceByAnu" />;
  }

  return (
    <div>
      {/* Full Width Header and Main Card */}
      <div className="w-full -mx-4 lg:-mx-8 px-4 lg:px-8">
        <h1 className="text-2xl font-semibold theme-heading mb-6">Sp Console</h1>

        {/* Main Card - Full Width */}
        <div className="border rounded-2xl p-8 shadow-sm mb-8 w-full" style={{ backgroundColor: "var(--theme-light, #f5f5f5)", borderColor: "var(--theme-light)" }}>
          {/* Header Icon & Title */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border-2" style={{ borderColor: "var(--theme-primary)" }}>
              <Code2 className="w-8 h-8" style={{ color: "var(--theme-primary)" }} />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">Developer Verification</h2>
            <p className="text-gray-600 text-sm mt-2 text-center">
              We are enhancing the Ui, Ux, Cx, Dx, Px. Do best serve best.
            </p>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowModal(true)}
              className="text-white px-6 py-2.5 rounded-lg font-medium transition-colors theme-button"
            >
              Continue to Sp Console
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections - Constrained Width */}
      <div className="max-w-4xl space-y-8">
        {/* How We Add Value Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">How We Add Value:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Product-first thinking focused on real user and business outcomes</li>
            <li>Clean architecture, scalable code, and future-ready design systems</li>
            <li>Transparent communication with clear ownership and accountability</li>
          </ul>
        </div>

        {/* Experience We Strengthen Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Experience We Strengthen</h3>
          
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900 mb-1">UI — User Interface</p>
              <p className="text-gray-700 text-sm">Creates visual clarity, brand consistency, and intuitive screen layouts. Improve by using structured design systems and accessible visual standards.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">UX — User Experience</p>
              <p className="text-gray-700 text-sm">Ensures smooth user flows, usability, and task efficiency. Improve through continuous testing and friction reduction.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">CX — Customer Experience</p>
              <p className="text-gray-700 text-sm">Builds trust through consistent interactions across all touchpoints. Improve by mapping journeys and resolving pain points early.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">DX — Developer Experience</p>
              <p className="text-gray-700 text-sm">Enables faster, reliable development with clean APIs and documentation. Improve by maintaining predictable workflows and well-documented systems.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">PX — Product Experience</p>
              <p className="text-gray-700 text-sm">Aligns product value with user needs and long-term business goals. Improve by iterating based on analytics, feedback, and real usage.</p>
            </div>
          </div>
        </div>

        {/* Our Commitment Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Our Commitment</h3>
          <p className="text-gray-700 leading-relaxed">
            We don't just build websites and applications we create reliable digital products that deliver long-term value. Every solution is crafted with precision, performance, and real-world usability in mind. Our team takes full ownership from design to delivery, ensuring consistency and excellence at every stage. We work as a technology partner, not just a service provider. Our clients take pride in products that are scalable, secure, and built to industry standards.
          </p>
        </div>
      </div>

      {/* Contact Us Section - Full Width */}
      <div className="w-full -mx-4 lg:-mx-8 px-4 lg:px-8 mt-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="theme-bg-accent rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-2">Call & WhatsApp</p>
              <p className="font-semibold text-sm text-gray-900">+9342 4264494</p>
            </div>
            <div className="theme-bg-accent rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-2">Email</p>
              <p className="font-semibold text-sm text-gray-900">ammardev99@gmail.com</p>
            </div>
            <div className="theme-bg-accent rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-2">Address</p>
              <p className="font-semibold text-sm text-gray-900">Camden Town, London, UK</p>
            </div>
            <div className="theme-bg-accent rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-2">Working Time</p>
              <p className="font-semibold text-sm text-gray-900">9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Key Modal */}
      <DeveloperKeyModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
