import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCompany } from "@/api/company.api";
import { getFooter } from "@/api/footer.api";

interface FooterLink {
  label: string;
  url: string;
  order: number;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
  order: number;
  enabled?: boolean;
}

export default function Footer() {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({
    company: "VERES",
    socialPosts: [] as Array<{ image: string; url: string; order: number }>,
  });
  const [footerData, setFooterData] = useState<{
    sections: FooterSection[];
    copyright: string;
  }>({
    sections: [],
    copyright: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [company, footer] = await Promise.all([
          getCompany(),
          getFooter().catch(() => ({ sections: [], copyright: "" })),
        ]);
        
        setCompanyData({
          company: company.company || "VERES",
          socialPosts: (company.socialPosts || []).filter((post: any) => post.image).slice(0, 8),
        });

        setFooterData({
          sections: (footer.sections || []).filter((s: FooterSection) => s.enabled !== false).sort((a: FooterSection, b: FooterSection) => a.order - b.order),
          copyright: footer.copyright || `© ${new Date().getFullYear()} ${company.company || "VERES"}. All rights reserved.`,
        });
      } catch (err) {
        console.error("Failed to load footer data", err);
      }
    };
    loadData();
  }, []);

  const handleLinkClick = (url: string) => {
    if (!url || url === "#") return;
    
    // Check if it's an external URL
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank");
    } else {
      // Internal route
      navigate(url);
    }
  };

  const enabledSections = footerData.sections.filter(s => s.enabled !== false);

  return (
    <footer className="text-gray-300 mt-20" style={{ backgroundColor: "var(--theme-dark, #6B4A2C)" }}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Logo and Footer Sections */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo */}
            <div className="flex flex-col space-y-4">
              <span className="text-white font-serif text-xl font-semibold">{companyData.company}</span>
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} {companyData.company}. All Rights Reserved.</p>
            </div>

            {/* Footer Sections from SP Panel */}
            {enabledSections.map((section, index) => (
              <div key={index} className="flex flex-col space-y-2 text-sm">
                <h3 className="text-white font-semibold mb-2">{section.title}</h3>
                {section.links.map((link, linkIndex) => (
                  <button
                    key={linkIndex}
                    onClick={() => handleLinkClick(link.url)}
                    className="text-left text-gray-300 hover:underline"
                    style={{ cursor: "pointer" }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Right side - Social Posts Gallery - only show if there are posts */}
          {companyData.socialPosts.length > 0 && (
            <div className="lg:ml-auto">
              <div className="grid grid-cols-4 gap-2">
                {companyData.socialPosts.map((post, index) => (
                  <a
                    key={index}
                    href={post.url || "#"}
                    target={post.url ? "_blank" : undefined}
                    rel={post.url ? "noopener noreferrer" : undefined}
                    className="w-12 h-12 rounded overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={post.image}
                      alt={`Social post ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-gray-600 pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <span>{footerData.copyright || `© ${new Date().getFullYear()} ${companyData.company}. All rights reserved.`}</span>
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
