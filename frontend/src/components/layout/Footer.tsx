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
        // Always fetch fresh data to ensure social posts are up to date
        // Fetch from API
        const [companyData, footerData] = await Promise.all([
          getCompany(),
          getFooter().catch(() => ({ sections: [], copyright: "" })),
        ]);

        const company = companyData;
        const footer = footerData;

        // Cache the data (24 hours)
        setCachedData(CACHE_KEYS.COMPANY, company);
        setCachedData(CACHE_KEYS.FOOTER, footer);
        
        // Process social posts - ensure they have valid images
        // Helper to get full image URL
        const getImageUrl = (imageUrl: string): string => {
          if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === "") {
            return "";
          }
          
          const trimmed = imageUrl.trim();
          
          // If it's a base64 data URL, return as is (shouldn't happen after upload, but handle it)
          if (trimmed.startsWith('data:')) {
            return "";
          }
          
          // Exclude Facebook CDN URLs (they give 403 errors due to hotlink protection)
          const imageLower = trimmed.toLowerCase();
          if (imageLower.includes('fbcdn.net') || 
              imageLower.includes('scontent.') ||
              (imageLower.includes('facebook.com') && imageLower.includes('scontent'))) {
            return ""; // Return empty string to filter out
          }
          
          // If it's already a full URL (Cloudinary or http/https), return as is
          if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return trimmed;
          }
          
          // If it's a relative path, construct full URL
          const urls = (import.meta.env.VITE_API_URLS || "").split(",").map((url: string) => url.trim()).filter(Boolean);
          const isLocalhost = typeof window !== 'undefined' && (
            window.location.hostname === "localhost" || 
            window.location.hostname === "127.0.0.1"
          );
          const API_BASE_URL = isLocalhost ? urls[0] : (urls[1] || urls[0] || import.meta.env.VITE_API_URL || "");
          const apiBaseWithoutApi = API_BASE_URL ? API_BASE_URL.replace('/api', '') : '';
          
          if (trimmed.startsWith('/')) {
            return `${apiBaseWithoutApi}${trimmed}`;
          }
          
          return `${apiBaseWithoutApi}/${trimmed}`;
        };
        
        const validSocialPosts = (company.socialPosts || [])
          .filter((post: any) => {
            if (!post || !post.image || typeof post.image !== 'string' || post.image.trim() === "") {
              return false;
            }
            
            // Exclude base64 (should be uploaded by now)
            if (post.image.startsWith('data:')) {
              return false;
            }
            
            // Exclude Facebook CDN URLs (they give 403 errors due to hotlink protection)
            const imageLower = post.image.toLowerCase();
            if (imageLower.includes('fbcdn.net') || 
                imageLower.includes('scontent.') ||
                (imageLower.includes('facebook.com') && imageLower.includes('scontent'))) {
              console.warn("Filtering out Facebook CDN URL (403 error):", post.image);
              return false;
            }
            
            return true;
          })
          .map((post: any) => {
            const imageUrl = getImageUrl(post.image);
            return {
              image: imageUrl,
              url: post.url || "#",
              order: post.order || 0
            };
          })
          .filter((post: any) => post.image !== "") // Remove posts with invalid URLs
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .slice(0, 8);
        
        console.log("Social Posts loaded:", {
          total: (company.socialPosts || []).length,
          valid: validSocialPosts.length,
          posts: validSocialPosts,
          rawPosts: company.socialPosts
        }); // Debug log
        
        // Double check - filter out any Facebook URLs that might have slipped through
        const finalValidPosts = validSocialPosts.filter((post: any) => {
          if (!post || !post.image) return false;
          const imageLower = post.image.toLowerCase();
          return !imageLower.includes('fbcdn.net') && 
                 !imageLower.includes('scontent.') &&
                 !(imageLower.includes('facebook.com') && imageLower.includes('scontent'));
        });
        
        console.log("Final filtered social posts:", {
          before: validSocialPosts.length,
          after: finalValidPosts.length,
          filtered: validSocialPosts.length - finalValidPosts.length
        });
        
        setCompanyData({
          company: company.company || "VERES",
          copyright: company.copyright || "",
          socialPosts: finalValidPosts,
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
                {companyData.socialPosts
                  .filter((post: any) => {
                    // Final filter - don't even render the component for Facebook URLs
                    if (!post || !post.image) return false;
                    const imageLower = post.image.toLowerCase();
                    return !imageLower.includes('fbcdn.net') && 
                           !imageLower.includes('scontent.') &&
                           !(imageLower.includes('facebook.com') && imageLower.includes('scontent'));
                  })
                  .map((post, index) => (
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
                          console.error("Failed to load social post image:", post.image, "for post:", post);
                          target.style.display = "none";
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.log("Successfully loaded social post image:", post.image);
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
