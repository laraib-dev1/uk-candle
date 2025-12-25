import React, { useState, useEffect } from "react";
import { getFooter } from "@/api/footer.api";
import { getCompany } from "@/api/company.api";

export default function Footer() {
  const [footerSections, setFooterSections] = useState<
    { title: string; links: { label: string; url: string; order: number }[]; order: number; enabled?: boolean }[]
  >([]);
  const [socialPosts, setSocialPosts] = useState<{ image: string; order: number }[]>([]);
  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [footerData, companyData] = await Promise.all([
          getFooter(),
          getCompany().catch(() => null),
        ]);
        setFooterSections((footerData?.sections || []).map((s: any) => ({ ...s, enabled: s.enabled !== false })));
        // showPreview checkbox controls footer visibility: true = show, false = hide
        setShowFooter(footerData?.showPreview === true);
        if (companyData?.socialPosts) {
          setSocialPosts(companyData.socialPosts.filter((p: any) => p.image).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)));
        }
      } catch (error) {
        console.error("Failed to load footer data:", error);
      }
    };
    loadData();
  }, []);

  const activeSections = footerSections.length > 0
    ? footerSections.filter((s) => s.enabled !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 3)
    : [];

  const galleryImages = socialPosts.length > 0 ? socialPosts.map((p) => p.image).slice(0, 8) : [];

  const hasColumns = activeSections.length > 0;
  const hasGallery = galleryImages.length > 0;
  const hasContent = hasColumns || hasGallery;

  // If footer disabled or nothing at all to show, hide footer entirely
  if (!showFooter || !hasContent) return null;

  return (
    <footer className="text-gray-300 mt-12" style={{ backgroundColor: "var(--theme-dark)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Left side: Logo and Footer Sections */}
          <div className="flex flex-col md:flex-row gap-8 flex-1">
            {/* Logo */}
            <div className="flex flex-col space-y-4">
              <span className="text-white font-serif text-xl font-semibold">Grace By Anu</span>
              <p className="text-xs text-gray-500">© {new Date().getFullYear()}  All Rights Reserved.</p>
            </div>

            {/* Dynamic Footer Sections (max 3 columns) */}
            {hasColumns &&
              activeSections.map((section, idx) => (
                <div key={idx} className="flex flex-col space-y-2 text-sm">
                  <h3 className="text-white font-semibold mb-2">{section.title}</h3>
                  {section.links.map((link, li) => (
                    <a
                      key={li}
                      href={link.url}
                      className="text-gray-300 hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
          </div>

          {/* Right side: Social posts gallery */}
          {galleryImages.length > 0 && (
            <div className="flex-shrink-0">
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Social post ${index + 1}`}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400" style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}>
          <span>© {new Date().getFullYear()}  All rights reserved.</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
