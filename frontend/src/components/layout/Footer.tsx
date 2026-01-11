import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCompany } from "@/api/company.api";
import { getFooter } from "@/api/footer.api";
import { getCachedData, setCachedData, CACHE_KEYS } from "@/utils/cache";

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
    copyright: "",
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
        // Try to get from cache first
        const cachedCompany = getCachedData<any>(CACHE_KEYS.COMPANY);
        const cachedFooter = getCachedData<any>(CACHE_KEYS.FOOTER);

        let company, footer;

        if (cachedCompany && cachedFooter) {
          // Use cached data
          company = cachedCompany;
          footer = cachedFooter;
        } else {
          // Fetch from API
          const [companyData, footerData] = await Promise.all([
            getCompany(),
            getFooter().catch(() => ({ sections: [], copyright: "" })),
          ]);

          company = companyData;
          footer = footerData;

          // Cache the data (24 hours)
          setCachedData(CACHE_KEYS.COMPANY, company);
          setCachedData(CACHE_KEYS.FOOTER, footer);
        }
        
        // Process social posts - ensure they have valid images
        const validSocialPosts = (company.socialPosts || [])
          .filter((post: any) => {
            return post && 
                   post.image && 
                   typeof post.image === 'string' && 
                   post.image.trim() !== "";
          })
          .map((post: any) => ({
            image: post.image.trim(),
            url: post.url || "#",
            order: post.order || 0
          }))
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .slice(0, 8);
        
        console.log("Social Posts loaded:", validSocialPosts.length, validSocialPosts); // Debug log
        
        setCompanyData({
          company: company.company || "VERES",
          copyright: company.copyright || "",
          socialPosts: validSocialPosts,
        });

        // Use copyright from company first, then footer, then default
        const copyrightText = company.copyright || footer.copyright || `© ${new Date().getFullYear()} ${company.company || "VERES"}. All rights reserved.`;
        setFooterData({
          sections: (footer.sections || []).filter((s: FooterSection) => s.enabled !== false).sort((a: FooterSection, b: FooterSection) => a.order - b.order),
          copyright: copyrightText,
        });
      } catch (err) {
        console.error("Failed to load footer data", err);
        // Try to use cached data as fallback
        const cachedCompany = getCachedData<any>(CACHE_KEYS.COMPANY);
        const cachedFooter = getCachedData<any>(CACHE_KEYS.FOOTER);
        if (cachedCompany) {
          setCompanyData({
            company: cachedCompany.company || "VERES",
            copyright: cachedCompany.copyright || "",
            socialPosts: (cachedCompany.socialPosts || [])
              .filter((post: any) => post && post.image && post.image.trim() !== "")
              .slice(0, 8),
          });
        }
        if (cachedFooter) {
          setFooterData({
            sections: (cachedFooter.sections || []).filter((s: FooterSection) => s.enabled !== false).sort((a: FooterSection, b: FooterSection) => a.order - b.order),
            copyright: cachedFooter.copyright || `© ${new Date().getFullYear()} ${cachedCompany?.company || "VERES"}. All rights reserved.`,
          });
        }
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
    <footer className="text-gray-300" style={{ backgroundColor: "var(--theme-dark, #6B4A2C)" }}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Left side - Logo and Footer Sections */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Logo */}
            <div className="flex flex-col space-y-4">
              <span className="text-white font-serif text-xl font-semibold">{companyData.company}</span>
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
          {companyData.socialPosts && companyData.socialPosts.length > 0 && (
            <div className="lg:ml-auto">
              <div className="grid grid-cols-4 gap-2">
                {companyData.socialPosts.map((post, index) => (
                  <a
                    key={index}
                    href={post.url || "#"}
                    target={post.url && post.url !== "#" ? "_blank" : undefined}
                    rel={post.url && post.url !== "#" ? "noopener noreferrer" : undefined}
                    className="w-12 h-12 rounded overflow-hidden hover:opacity-80 transition-opacity bg-gray-700"
                  >
                    <img
                      src={post.image}
                      alt={`Social post ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "block";
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-6 sm:mt-8 border-t border-gray-600 pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-2">
          <span className="text-center md:text-left">{footerData.copyright || `© ${new Date().getFullYear()} ${companyData.company}. All rights reserved.`}</span>
          <div className="flex gap-3 sm:gap-4">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
