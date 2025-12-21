import React, { useState } from "react";
import { Code2 } from "lucide-react";
import DeveloperKeyModal from "../../../components/developer/DeveloperKeyModal";

export default function SpConsolePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold theme-heading mb-6">Sp Console</h1>

      {/* Main Card */}
      <div className="bg-[#FDF8F4] border border-[#E8D4C4] rounded-2xl p-8 shadow-sm">
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#F5E6D8] rounded-full flex items-center justify-center mb-4">
            <Code2 className="w-8 h-8 theme-text-primary" />
          </div>
          <h2 className="text-xl font-bold theme-heading">Developer Verification</h2>
          <p className="text-gray-600 text-sm mt-1">
            We are enhancing the UI, Ux, Cx, Dx, Px. Do best serve best.
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

        {/* How We Add Value Section */}
        <div className="space-y-6 text-gray-700 text-sm">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">How We Add Value</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Product-first thinking focused on real user and business outcomes</li>
              <li>Clean architecture, scalable code, and future-ready design systems</li>
              <li>Transparent communication with clear ownership and accountability</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3">Experience We Strengthen</h3>
            
            <div className="space-y-4">
              <div>
                <p className="font-semibold">UI — User Interface</p>
                <p className="text-gray-600">Creates visual clarity, brand consistency, and intuitive screen layouts.</p>
                <p className="text-gray-500 text-xs">Improve by using structured design systems and accessible visual standards.</p>
              </div>

              <div>
                <p className="font-semibold">UX — User Experience</p>
                <p className="text-gray-600">Ensures smooth user flows, usability, and task efficiency.</p>
                <p className="text-gray-500 text-xs">Improve through continuous testing and friction reduction.</p>
              </div>

              <div>
                <p className="font-semibold">CX — Customer Experience</p>
                <p className="text-gray-600">Builds trust through consistent interactions across all touchpoints.</p>
                <p className="text-gray-500 text-xs">Improve by mapping journeys and resolving pain points early.</p>
              </div>

              <div>
                <p className="font-semibold">DX — Developer Experience</p>
                <p className="text-gray-600">Enables faster, reliable development with clean APIs and documentation.</p>
                <p className="text-gray-500 text-xs">Improve by maintaining predictable workflows and well-documented systems.</p>
              </div>

              <div>
                <p className="font-semibold">PX — Product Experience</p>
                <p className="text-gray-600">Aligns product value with user needs and long-term business goals.</p>
                <p className="text-gray-500 text-xs">Improve by iterating based on analytics, feedback, and real usage.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Our Commitment</h3>
            <p className="text-gray-600 leading-relaxed">
              We don't just build websites and applications we create reliable digital products that deliver long-term value. Every solution is crafted with precision, performance, and real-world usability in mind. Our team takes full ownership from design to delivery, ensuring consistency and excellence at every stage. We work as a technology partner, not just a service provider. Our clients take pride in products that are scalable, secure, and built to industry standards.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3">Contact Us</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#E8D4C4] rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Call & WhatsApp</p>
                <p className="font-semibold text-sm">+9342 4264494</p>
              </div>
              <div className="bg-[#E8D4C4] rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Email</p>
                <p className="font-semibold text-sm">ammardev99@gmail.com</p>
              </div>
              <div className="bg-[#E8D4C4] rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Address</p>
                <p className="font-semibold text-sm">Camden Town, London, UK</p>
              </div>
              <div className="bg-[#E8D4C4] rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Working Time</p>
                <p className="font-semibold text-sm">9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Key Modal */}
      <DeveloperKeyModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
