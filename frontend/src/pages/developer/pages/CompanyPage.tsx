import React, { useState, useEffect, useRef } from "react";
import { Building2, Edit, RotateCcw, Upload, Image as ImageIcon } from "lucide-react";
import { getCompany, updateCompany } from "@/api/company.api";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/components/ui/toast";

export default function CompanyPage() {
  const { updateTheme } = useTheme();
  const { success, error } = useToast();
  const [companyData, setCompanyData] = useState({
    company: "",
    slogan: "",
    email: "",
    phone: "",
    supportEmail: "",
    address: "",
    logo: "",
    favicon: "",
    socialLinks: {
      facebook: "",
      tiktok: "",
      instagram: "",
      youtube: "",
      linkedin: "",
      other: "",
    },
    socialPosts: Array(6).fill(null).map((_, i) => ({ image: "", order: i })),
    brandTheme: {
      primary: "#8C5934",
      accent: "",
      dark: "",
      light: "",
    },
  });

  const [originalData, setOriginalData] = useState(companyData);
  const [isLoading, setIsLoading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const socialPostInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    loadCompanyData();
  }, []);

  // Update favicon and title when company data changes
  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    
    if (companyData.favicon && companyData.favicon.trim() !== "") {
      // If favicon is a Cloudinary URL (starts with http/https), use it directly
      // Otherwise, prepend API URL
      const faviconUrl = companyData.favicon.startsWith("http") 
        ? companyData.favicon 
        : `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}${companyData.favicon.startsWith("/") ? "" : "/"}${companyData.favicon}`;
      
      link.href = faviconUrl;
      link.onerror = () => {
        // Fallback to default logo if favicon fails to load
        link.href = "/logo-removebg-preview.png";
      };
    } else {
      // Use default logo as favicon if no favicon is set
      link.href = "/logo-removebg-preview.png";
    }
    
    if (companyData.company) {
      document.title = companyData.company || "Grace by Anu";
    }
  }, [companyData.favicon, companyData.company]);

  const loadCompanyData = async () => {
    try {
      const data = await getCompany();
      setCompanyData(data);
      setOriginalData(data);
      if (data.brandTheme) {
        updateTheme(data.brandTheme);
      }
    } catch (error) {
      console.error("Failed to load company data:", error);
    }
  };

  const handleChange = (field: string, value: any) => {
  setCompanyData((prev) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");

      const parentValue = prev[parent as keyof typeof prev];

      return {
        ...prev,
        [parent]: {
          ...(typeof parentValue === "object" && parentValue !== null
            ? parentValue
            : {}),
          [child]: value,
        },
      };
    }

    return { ...prev, [field]: value };
  });
};


  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (logoInputRef.current) {
        logoInputRef.current.files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange("logo", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (faviconInputRef.current) {
        faviconInputRef.current.files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange("favicon", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialPostUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPosts = [...companyData.socialPosts];
        newPosts[index] = { ...newPosts[index], image: event.target?.result as string };
        handleChange("socialPosts", newPosts);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrimaryColorChange = (color: string) => {
    const blendColor = (color1: string, color2: string, ratio: number) => {
      const hex1 = color1.replace('#', '');
      const hex2 = color2.replace('#', '');
      
      const r1 = parseInt(hex1.substr(0, 2), 16);
      const g1 = parseInt(hex1.substr(2, 2), 16);
      const b1 = parseInt(hex1.substr(4, 2), 16);
      
      const r2 = parseInt(hex2.substr(0, 2), 16);
      const g2 = parseInt(hex2.substr(2, 2), 16);
      const b2 = parseInt(hex2.substr(4, 2), 16);
      
      const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
      const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
      const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
      
      return `#${[r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('')}`;
    };

    const newTheme = {
      primary: color,
      dark: blendColor(color, "#000000", 0.5),
      light: blendColor(color, "#FFFFFF", 0.5),
      accent: blendColor(color, "#FFFFFF", 0.75),
    };

    handleChange("brandTheme", newTheme);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const formData: any = {
        ...companyData,
        logoFile: logoInputRef.current?.files?.[0],
        faviconFile: faviconInputRef.current?.files?.[0],
      };

      const updated = await updateCompany(formData);
      setCompanyData(updated);
      setOriginalData(updated);
      if (updated.brandTheme) {
        updateTheme(updated.brandTheme);
      }
      // Update favicon and title immediately after update
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      
      if (updated.favicon && updated.favicon.trim() !== "") {
        const faviconUrl = updated.favicon.startsWith("http") 
          ? updated.favicon 
          : `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}${updated.favicon.startsWith("/") ? "" : "/"}${updated.favicon}`;
        link.href = faviconUrl;
        link.onerror = () => {
          link.href = "/logo-removebg-preview.png";
        };
      } else {
        link.href = "/logo-removebg-preview.png";
      }
      if (updated.company) {
        document.title = updated.company || "Grace by Anu";
      }
      success("Company settings updated successfully!");
    } catch (err) {
      console.error("Failed to update company:", err);
      error("Failed to update company settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    setCompanyData(originalData);
    if (logoInputRef.current) logoInputRef.current.value = "";
    if (faviconInputRef.current) faviconInputRef.current.value = "";
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold theme-heading">Company</h1>
        <div className="flex gap-2">
          <button
            onClick={handleDiscard}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={18} />
            Discard
          </button>
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
            style={{
              backgroundColor: "var(--theme-primary)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "var(--theme-dark)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "var(--theme-primary)";
              }
            }}
          >
            {isLoading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            <Edit size={18} />
            Update
          </button>
        </div>
      </div>

      {/* Company Info Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <Building2 className="w-5 h-5 theme-text-primary" />
          <h2 className="font-semibold theme-heading">Company Info</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <div className="flex items-center gap-4">
              {companyData.logo ? (
                <img
                  src={companyData.logo}
                  alt="Logo"
                  className="w-24 h-24 object-contain border border-gray-200 rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Upload Logo
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  {companyData.company || "Company name will be used as logo name"}
                </p>
              </div>
            </div>
          </div>

          {/* Company Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={companyData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8734B] focus:border-[#A8734B] outline-none"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan
              </label>
              <input
                type="text"
                value={companyData.slogan}
                onChange={(e) => handleChange("slogan", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8734B] focus:border-[#A8734B] outline-none"
                placeholder="Slogan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={companyData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8734B] focus:border-[#A8734B] outline-none"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={companyData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8734B] focus:border-[#A8734B] outline-none"
                placeholder="Phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={companyData.supportEmail}
                onChange={(e) => handleChange("supportEmail", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8734B] focus:border-[#A8734B] outline-none"
                placeholder="Support Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={companyData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8734B] focus:border-[#A8734B] outline-none"
                placeholder="Address"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Social Links</h2>
        </div>
        <div className="p-6 grid grid-cols-3 gap-4">
          {Object.entries(companyData.socialLinks).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key}
              </label>
              <input
                type="url"
                value={value}
                onChange={(e) => handleChange(`socialLinks.${key}`, e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8734B] focus:border-[#A8734B] outline-none"
                placeholder={`${key} URL`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Social Posts Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Social Posts</h2>
        </div>
        <div className="p-6 grid grid-cols-6 gap-4">
          {companyData.socialPosts.map((post, index) => (
            <div key={index}>
              <input
ref={(el) => {
  socialPostInputRefs.current[index] = el;
}}
                type="file"
                accept="image/*"
                onChange={(e) => handleSocialPostUpload(index, e)}
                className="hidden"
              />
              <button
                onClick={() => socialPostInputRefs.current[index]?.click()}
                className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-[#A8734B] transition-colors flex items-center justify-center"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={`Post ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Theme Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Brand Theme</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {["Primary", "Accent", "Dark", "Light"].map((label) => {
              const key = label.toLowerCase() as keyof typeof companyData.brandTheme;
              const color = companyData.brandTheme[key] || "";
              return (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        if (label === "Primary") {
                          handlePrimaryColorChange(e.target.value);
                        } else {
                          handleChange(`brandTheme.${key}`, e.target.value);
                        }
                      }}
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => {
                        if (label === "Primary") {
                          handlePrimaryColorChange(e.target.value);
                        } else {
                          handleChange(`brandTheme.${key}`, e.target.value);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8734B] focus:border-[#A8734B] outline-none text-sm font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
