import React, { useState, useEffect } from "react";
import { RichTextEditor } from "@mantine/rte";
import { getBanners, updateBanner, type Banner, type BannerSlot } from "@/api/banner.api";
import { getAllContent, updateContent, getContentByType, type ContentPage, type ContentType } from "@/api/content.api";
import { getCompany, updateCompany } from "@/api/company.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import FilterTabs from "@/components/ui/FilterTabs";
import ImageCropperModal from "@/components/admin/product/ImageCropperModal";

// Helper function to preserve alignment styles from RichTextEditor
const processAlignmentStyles = (html: string): string => {
  if (!html) return html;
  
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Find all elements with Quill alignment classes
  const elements = tempDiv.querySelectorAll('[class*="ql-align"]');
  
  elements.forEach((el) => {
    const element = el as HTMLElement;
    const classes = element.className;
    
    // Determine alignment from class
    let alignment = '';
    if (classes.includes('ql-align-center')) {
      alignment = 'center';
    } else if (classes.includes('ql-align-right')) {
      alignment = 'right';
    } else if (classes.includes('ql-align-justify')) {
      alignment = 'justify';
    } else if (classes.includes('ql-align-left')) {
      alignment = 'left';
    }
    
    if (alignment) {
      // Get existing style attribute
      const existingStyle = element.getAttribute('style') || '';
      // Remove any existing text-align from style
      const cleanedStyle = existingStyle.replace(/text-align\s*:\s*[^;]+;?/gi, '').trim();
      // Add text-align to style
      const newStyle = cleanedStyle 
        ? `${cleanedStyle}; text-align: ${alignment};`
        : `text-align: ${alignment};`;
      element.setAttribute('style', newStyle);
      // Remove Quill alignment classes
      element.className = element.className
        .replace(/\s*ql-align-(center|right|justify|left)\s*/g, ' ')
        .trim();
    }
  });
  
  return tempDiv.innerHTML;
};

type TabType = "banners" | "privacy" | "terms" | "faq" | "checkout";

export type CheckoutSettings = {
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
  taxEnabled: boolean;
  taxRate: number;
  shippingEnabled: boolean;
  shippingCharges: number;
};

const defaultCheckoutSettings: CheckoutSettings = {
  codEnabled: true,
  onlinePaymentEnabled: true,
  taxEnabled: false,
  taxRate: 0,
  shippingEnabled: false,
  shippingCharges: 0,
};

export default function AssetsPage() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("banners");
  
  // Edit mode states
  const [editingBannerSlot, setEditingBannerSlot] = useState<BannerSlot | null>(null);
  const [isEditingPrivacy, setIsEditingPrivacy] = useState(false);
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [isEditingFAQ, setIsEditingFAQ] = useState(false);
  
  // Banners state
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerLoading, setBannerLoading] = useState(false);
  type BannerFormSlot = { targetUrl: string; imageFile: File | null; imagePreview: string | null; imageRemoved?: boolean };
  const [bannerFormData, setBannerFormData] = useState<Record<BannerSlot, BannerFormSlot>>({
    "hero-main": { targetUrl: "", imageFile: null, imagePreview: null },
    "hero-secondary": { targetUrl: "", imageFile: null, imagePreview: null },
    "hero-tertiary": { targetUrl: "", imageFile: null, imagePreview: null },
    "hero-last": { targetUrl: "", imageFile: null, imagePreview: null },
    "shop-main": { targetUrl: "", imageFile: null, imagePreview: null },
  });
  const [bannerOriginalData, setBannerOriginalData] = useState<Record<BannerSlot, { targetUrl: string; imageFile: File | null; imagePreview: string | null }>>({
    "hero-main": { targetUrl: "", imageFile: null, imagePreview: null },
    "hero-secondary": { targetUrl: "", imageFile: null, imagePreview: null },
    "hero-tertiary": { targetUrl: "", imageFile: null, imagePreview: null },
    "hero-last": { targetUrl: "", imageFile: null, imagePreview: null },
    "shop-main": { targetUrl: "", imageFile: null, imagePreview: null },
  });
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [currentBannerSlot, setCurrentBannerSlot] = useState<BannerSlot | null>(null);
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  
  // Content state - original and working copies
  const [privacyContent, setPrivacyContent] = useState<ContentPage | null>(null);
  const [privacyContentOriginal, setPrivacyContentOriginal] = useState<ContentPage | null>(null);
  
  const [termsContent, setTermsContent] = useState<ContentPage | null>(null);
  const [termsContentOriginal, setTermsContentOriginal] = useState<ContentPage | null>(null);
  
  const [faqContent, setFaqContent] = useState<ContentPage | null>(null);
  const [faqContentOriginal, setFaqContentOriginal] = useState<ContentPage | null>(null);
  
  const [contentLoading, setContentLoading] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  
  // FAQ state
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });
  const [editingFAQIndex, setEditingFAQIndex] = useState<number | null>(null);

  // Checkout settings state
  const [checkoutSettings, setCheckoutSettings] = useState<CheckoutSettings>(defaultCheckoutSettings);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSaving, setCheckoutSaving] = useState(false);

  // Load banners
  useEffect(() => {
    if (activeTab === "banners") {
      loadBanners();
    }
  }, [activeTab]);

  // Load content
  useEffect(() => {
    if (activeTab === "privacy" || activeTab === "terms" || activeTab === "faq") {
      loadContent();
    }
  }, [activeTab]);

  // Load checkout settings
  useEffect(() => {
    if (activeTab === "checkout") {
      const load = async () => {
        setCheckoutLoading(true);
        try {
          const data = await getCompany();
          const c = (data as any)?.checkout;
          if (c && typeof c === "object") {
            setCheckoutSettings({
              codEnabled: c.codEnabled !== false,
              onlinePaymentEnabled: c.onlinePaymentEnabled !== false,
              taxEnabled: !!c.taxEnabled,
              taxRate: typeof c.taxRate === "number" ? c.taxRate : Number(c.taxRate) || 0,
              shippingEnabled: !!c.shippingEnabled,
              shippingCharges: typeof c.shippingCharges === "number" ? c.shippingCharges : Number(c.shippingCharges) || 0,
            });
          }
        } catch (err) {
          console.error("Failed to load checkout settings", err);
          error("Failed to load checkout settings");
        } finally {
          setCheckoutLoading(false);
        }
      };
      load();
    }
  }, [activeTab, error]);

  const loadBanners = async () => {
    setBannerLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
      // Initialize form data with existing banners
      const initialData: Record<BannerSlot, BannerFormSlot> = {
        "hero-main": { targetUrl: "", imageFile: null, imagePreview: null },
        "hero-secondary": { targetUrl: "", imageFile: null, imagePreview: null },
        "hero-tertiary": { targetUrl: "", imageFile: null, imagePreview: null },
        "hero-last": { targetUrl: "", imageFile: null, imagePreview: null },
        "shop-main": { targetUrl: "", imageFile: null, imagePreview: null },
      };
      data.forEach((banner) => {
        if (banner.slot in initialData) {
          initialData[banner.slot as BannerSlot] = {
            targetUrl: banner.targetUrl || "",
            imageFile: null,
            imagePreview: banner.imageUrl,
            imageRemoved: false,
          };
        }
      });
      setBannerFormData(initialData);
      setBannerOriginalData(JSON.parse(JSON.stringify(initialData)));
    } catch (err) {
      console.error("Failed to load banners:", err);
      error("Failed to load banners");
    } finally {
      setBannerLoading(false);
    }
  };

  const loadContent = async () => {
    setContentLoading(true);
    try {
      if (activeTab === "privacy") {
        const data = await getContentByType("privacy");
        setPrivacyContent(data);
        setPrivacyContentOriginal(JSON.parse(JSON.stringify(data)));
      } else if (activeTab === "terms") {
        const data = await getContentByType("terms");
        setTermsContent(data);
        setTermsContentOriginal(JSON.parse(JSON.stringify(data)));
      } else if (activeTab === "faq") {
        const data = await getContentByType("faqs");
        setFaqContent(data);
        setFaqContentOriginal(JSON.parse(JSON.stringify(data)));
      }
    } catch (err) {
      console.error("Failed to load content:", err);
      error("Failed to load content");
    } finally {
      setContentLoading(false);
    }
  };

  const handleBannerImageSelect = (file: File, slot: BannerSlot) => {
    setCurrentBannerSlot(slot);
    setCurrentImageFile(file);
    setShowImageCropper(true);
  };

  const handleImageCrop = (croppedFile: File) => {
    if (!currentBannerSlot) return;
    const preview = URL.createObjectURL(croppedFile);
    setBannerFormData({
      ...bannerFormData,
      [currentBannerSlot]: {
        ...bannerFormData[currentBannerSlot],
        imageFile: croppedFile,
        imagePreview: preview,
      },
    });
    setShowImageCropper(false);
    setCurrentBannerSlot(null);
  };

  const startEditBanner = (slot: BannerSlot) => {
    const banner = banners.find((b) => b.slot === slot);
    setBannerFormData({
      ...bannerFormData,
      [slot]: {
        targetUrl: banner?.targetUrl || "",
        imageFile: null,
        imagePreview: banner?.imageUrl || null,
        imageRemoved: false,
      },
    });
    setBannerOriginalData({
      ...bannerOriginalData,
      [slot]: {
        targetUrl: banner?.targetUrl || "",
        imageFile: null,
        imagePreview: banner?.imageUrl || null,
      },
    });
    setEditingBannerSlot(slot);
  };

  const discardBanner = (slot: BannerSlot) => {
    setBannerFormData({
      ...bannerFormData,
      [slot]: { ...bannerOriginalData[slot] },
    });
    setEditingBannerSlot(null);
  };

  const saveBanner = async (slot: BannerSlot) => {
    try {
      const formSlot = bannerFormData[slot];
      const clearImage = !!(formSlot.imageRemoved && !formSlot.imageFile);
      await updateBanner(slot, {
        targetUrl: formSlot.targetUrl,
        file: formSlot.imageFile,
        clearImage,
      });
      success("Banner updated successfully!");
      setEditingBannerSlot(null);
      setBannerFormData({
        ...bannerFormData,
        [slot]: {
          ...bannerFormData[slot],
          imageFile: null,
          imageRemoved: false,
        },
      });
      loadBanners();
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update banner");
    }
  };

  const saveCheckoutSettings = async () => {
    setCheckoutSaving(true);
    try {
      await updateCompany({ checkout: checkoutSettings });
      success("Checkout settings saved.");
    } catch (err: any) {
      error(err?.response?.data?.message || "Failed to save checkout settings");
    } finally {
      setCheckoutSaving(false);
    }
  };

  const startEditPrivacy = () => {
    setIsEditingPrivacy(true);
  };

  const discardPrivacy = () => {
    if (privacyContentOriginal) {
      setPrivacyContent(JSON.parse(JSON.stringify(privacyContentOriginal)));
    }
    setIsEditingPrivacy(false);
  };

  const updatePrivacy = async () => {
    if (!privacyContent) return;
    setSavingContent(true);
    try {
      // Process alignment styles one more time before saving
      const description = processAlignmentStyles(privacyContent.description);
      
      await updateContent("privacy", {
        title: privacyContent.title,
        subTitle: privacyContent.subTitle,
        description: description,
      });
      success("Privacy Policy updated successfully!");
      setIsEditingPrivacy(false);
      loadContent();
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update privacy policy");
    } finally {
      setSavingContent(false);
    }
  };

  const startEditTerms = () => {
    setIsEditingTerms(true);
  };

  const discardTerms = () => {
    if (termsContentOriginal) {
      setTermsContent(JSON.parse(JSON.stringify(termsContentOriginal)));
    }
    setIsEditingTerms(false);
  };

  const updateTerms = async () => {
    if (!termsContent) return;
    setSavingContent(true);
    try {
      // Process alignment styles one more time before saving
      const description = processAlignmentStyles(termsContent.description);
      
      await updateContent("terms", {
        title: termsContent.title,
        subTitle: termsContent.subTitle,
        description: description,
      });
      success("Terms & Conditions updated successfully!");
      setIsEditingTerms(false);
      loadContent();
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update terms & conditions");
    } finally {
      setSavingContent(false);
    }
  };

  const startEditFAQ = () => {
    setIsEditingFAQ(true);
  };

  const discardFAQ = () => {
    if (faqContentOriginal) {
      setFaqContent(JSON.parse(JSON.stringify(faqContentOriginal)));
    }
    setNewFAQ({ question: "", answer: "" });
    setEditingFAQIndex(null);
    setIsEditingFAQ(false);
  };

  const updateFAQ = async () => {
    if (!faqContent) return;
    setSavingContent(true);
    try {
      // Process alignment styles in FAQ answers before saving
      const faqs = (faqContent.faqs || []).map(faq => ({
        ...faq,
        answer: processAlignmentStyles(faq.answer)
      }));
      
      await updateContent("faqs", {
        title: faqContent.title,
        subTitle: faqContent.subTitle,
        description: faqContent.description,
        faqs: faqs,
      });
      success("FAQ updated successfully!");
      setIsEditingFAQ(false);
      setNewFAQ({ question: "", answer: "" });
      setEditingFAQIndex(null);
      loadContent();
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update FAQ");
    } finally {
      setSavingContent(false);
    }
  };

  const addFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) {
      error("Please fill in both question and answer");
      return;
    }
    
    if (!faqContent) return;
    
    const updatedFAQs = [...(faqContent.faqs || []), newFAQ];
    setFaqContent({ ...faqContent, faqs: updatedFAQs });
    setNewFAQ({ question: "", answer: "" });
  };

  const updateFAQItem = (index: number) => {
    if (!faqContent) return;
    
    const updatedFAQs = [...(faqContent.faqs || [])];
    updatedFAQs[index] = newFAQ;
    setFaqContent({ ...faqContent, faqs: updatedFAQs });
    setEditingFAQIndex(null);
    setNewFAQ({ question: "", answer: "" });
  };

  const deleteFAQ = (index: number) => {
    if (!faqContent) return;
    
    const updatedFAQs = faqContent.faqs?.filter((_, i) => i !== index) || [];
    setFaqContent({ ...faqContent, faqs: updatedFAQs });
  };

  const startEditFAQItem = (index: number) => {
    if (!faqContent?.faqs) return;
    setNewFAQ(faqContent.faqs[index]);
    setEditingFAQIndex(index);
  };

  // Recommended banner image sizes per slot, matching how they appear on the site:
  // - Full-width banners (hero-main, hero-tertiary, shop-main): 1920×600
  // - Half-width side-image banners (hero-secondary, hero-last): ~4:3
  const BANNER_CONFIG: Record<BannerSlot, { aspect: number; label: string }> = {
    "hero-main": { aspect: 1920 / 600, label: "1920×600" },
    "hero-secondary": { aspect: 4 / 3, label: "1200×900 (4:3)" },
    "hero-tertiary": { aspect: 1920 / 600, label: "1920×600" },
    "hero-last": { aspect: 4 / 3, label: "1200×900 (4:3)" },
    "shop-main": { aspect: 1920 / 600, label: "1920×600" },
  };
  const bannerSlots: { slot: BannerSlot; label: string }[] = [
    { slot: "hero-main", label: "Hero Main (Landing top)" },
    { slot: "hero-secondary", label: "Hero Secondary" },
    { slot: "hero-tertiary", label: "Hero Tertiary" },
    { slot: "hero-last", label: "Hero Last (Above Feedback)" },
    { slot: "shop-main", label: "Shop Main" },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not updated";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        {/* Tabs */}
        <div className="flex gap-4 items-center flex-wrap">
          <h1 className="text-2xl font-semibold theme-heading">Assets</h1>
          <FilterTabs
            tabs={[
              { id: "banners", label: "Banners" },
              { id: "privacy", label: "Privacy Policy" },
              { id: "terms", label: "Terms & Conditions" },
              { id: "faq", label: "FAQ" },
              { id: "checkout", label: "Checkout" },
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as any)}
          />
        </div>
      </div>

      {/* Content */}

      {/* Banners Tab */}
      {activeTab === "banners" && (
        <div className="space-y-6">
          {bannerLoading ? (
            <p>Loading banners...</p>
          ) : (
            bannerSlots.map(({ slot, label }) => {
              const banner = banners.find((b) => b.slot === slot);
              const isEditing = editingBannerSlot === slot;
              const formData = bannerFormData[slot];
              const imageUrl = formData.imagePreview || banner?.imageUrl;
              const config = BANNER_CONFIG[slot];

              return (
                <div key={slot} className="bg-white p-6 rounded-lg border border-gray-200 relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{label}</h3>
                    {!isEditing && (
                      <Button
                        onClick={() => startEditBanner(slot)}
                        className="theme-button text-white"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                  
                  {!isEditing ? (
                    <div className="space-y-4">
                      {imageUrl && (
                        <div>
                          {banner?.targetUrl ? (
                            <a
                              href={banner.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block cursor-pointer"
                            >
                              <img
                                src={imageUrl}
                                alt={label}
                                className="w-full object-cover rounded border hover:opacity-90 transition-opacity"
                                style={{ aspectRatio: config.aspect }}
                              />
                            </a>
                          ) : (
                            <img
                              src={imageUrl}
                              alt={label}
                              className="w-full object-cover rounded border"
                              style={{ aspectRatio: config.aspect }}
                            />
                          )}
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Target URL:</strong> {banner?.targetUrl || "Not set"}
                        </p>
                      </div>
                      {banner?.updatedAt && (
                        <div className="text-right">
                          <span className="text-sm text-gray-500">
                            Updated: {formatDate(banner.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Banner Image{" "}
                          <span className="text-gray-500 font-normal">
                            (recommended: {config.label}px)
                          </span>
                        </label>
                        {formData.imagePreview ? (
                          <div className="relative">
                            <img
                              src={formData.imagePreview}
                              alt="Preview"
                              className="w-full object-cover rounded border"
                              style={{ aspectRatio: config.aspect }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setBannerFormData({
                                  ...bannerFormData,
                                  [slot]: {
                                    ...formData,
                                    imagePreview: null,
                                    imageFile: null,
                                    imageRemoved: true,
                                  },
                                });
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                            >
                              Remove image
                            </button>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleBannerImageSelect(e.target.files[0], slot);
                                }
                              }}
                              className="block"
                            />
                            {banner?.imageUrl && (
                              <p className="text-sm text-gray-500 mt-2">
                                Current image will be kept if no new image is uploaded
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Target URL</label>
                        <Input
                          value={formData.targetUrl}
                          onChange={(e) =>
                            setBannerFormData({
                              ...bannerFormData,
                              [slot]: {
                                ...formData,
                                targetUrl: e.target.value,
                              },
                            })
                          }
                          placeholder="https://example.com"
                          className="w-full"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => saveBanner(slot)}
                          className="theme-button text-white"
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => discardBanner(slot)}
                          variant="outline"
                        >
                          Discard
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Privacy Policy Tab */}
      {activeTab === "privacy" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 relative">
          {contentLoading ? (
            <p>Loading...</p>
          ) : privacyContent ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Privacy Policy</h2>
                {!isEditingPrivacy && (
                  <Button
                    onClick={startEditPrivacy}
                    className="theme-button text-white"
                  >
                    Edit
                  </Button>
                )}
              </div>

              {!isEditingPrivacy ? (
                <div className="space-y-4 pb-8">
                  <div>
                    <h3 className="font-semibold">{privacyContent.title}</h3>
                    <p className="text-gray-600">{privacyContent.subTitle}</p>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: privacyContent.description }}
                    className="prose max-w-none content-area"
                  />
                  {privacyContent.lastUpdated && (
                    <div className="text-right absolute bottom-4 right-6">
                      <span className="text-sm text-gray-500">
                        Updated: {formatDate(privacyContent.lastUpdated)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={privacyContent.title}
                      onChange={(e) =>
                        setPrivacyContent({ ...privacyContent, title: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <Input
                      value={privacyContent.subTitle}
                      onChange={(e) =>
                        setPrivacyContent({ ...privacyContent, subTitle: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <RichTextEditor
                      value={privacyContent.description}
                      onChange={(value) => {
                        // Process HTML to ensure alignment styles are preserved
                        const processedValue = processAlignmentStyles(value);
                        setPrivacyContent({ ...privacyContent, description: processedValue });
                      }}
                      className="w-full bg-white text-gray-900"
                      controls={[
                        ['bold', 'italic', 'underline', 'strike'],
                        ['h1', 'h2', 'h3'],
                        ['unorderedList', 'orderedList'],
                        ['link', 'image', 'video'],
                        ['alignLeft', 'alignCenter', 'alignRight'],
                        ['blockquote', 'code'],
                        ['sup', 'sub'],
                        ['clean'],
                      ]}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={updatePrivacy}
                      className="theme-button text-white"
                      disabled={savingContent}
                    >
                      {savingContent ? "Updating..." : "Update"}
                    </Button>
                    <Button
                      onClick={discardPrivacy}
                      variant="outline"
                      disabled={savingContent}
                    >
                      Discard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}

      {/* Terms & Conditions Tab */}
      {activeTab === "terms" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 relative">
          {contentLoading ? (
            <p>Loading...</p>
          ) : termsContent ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Terms & Conditions</h2>
                {!isEditingTerms && (
                  <Button
                    onClick={startEditTerms}
                    className="theme-button text-white"
                  >
                    Edit
                  </Button>
                )}
              </div>

              {!isEditingTerms ? (
                <div className="space-y-4 pb-8">
                  <div>
                    <h3 className="font-semibold">{termsContent.title}</h3>
                    <p className="text-gray-600">{termsContent.subTitle}</p>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: termsContent.description }}
                    className="prose max-w-none content-area"
                  />
                  {termsContent.lastUpdated && (
                    <div className="text-right absolute bottom-4 right-6">
                      <span className="text-sm text-gray-500">
                        Updated: {formatDate(termsContent.lastUpdated)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={termsContent.title}
                      onChange={(e) =>
                        setTermsContent({ ...termsContent, title: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <Input
                      value={termsContent.subTitle}
                      onChange={(e) =>
                        setTermsContent({ ...termsContent, subTitle: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <RichTextEditor
                      value={termsContent.description}
                      onChange={(value) => {
                        // Process HTML to ensure alignment styles are preserved
                        const processedValue = processAlignmentStyles(value);
                        setTermsContent({ ...termsContent, description: processedValue });
                      }}
                      className="w-full bg-white text-gray-900"
                      controls={[
                        ['bold', 'italic', 'underline', 'strike'],
                        ['h1', 'h2', 'h3'],
                        ['unorderedList', 'orderedList'],
                        ['link', 'image', 'video'],
                        ['alignLeft', 'alignCenter', 'alignRight'],
                        ['blockquote', 'code'],
                        ['sup', 'sub'],
                        ['clean'],
                      ]}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={updateTerms}
                      className="theme-button text-white"
                      disabled={savingContent}
                    >
                      {savingContent ? "Updating..." : "Update"}
                    </Button>
                    <Button
                      onClick={discardTerms}
                      variant="outline"
                      disabled={savingContent}
                    >
                      Discard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 relative">
          {contentLoading ? (
            <p>Loading...</p>
          ) : faqContent ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">FAQ</h2>
                {!isEditingFAQ && (
                  <Button
                    onClick={startEditFAQ}
                    className="theme-button text-white"
                  >
                    Edit
                  </Button>
                )}
              </div>

              {!isEditingFAQ ? (
                <div className="space-y-4 pb-8">
                  <div>
                    <h3 className="font-semibold">{faqContent.title}</h3>
                    <p className="text-gray-600">{faqContent.subTitle}</p>
                  </div>

                  {/* FAQs List */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">FAQs ({faqContent.faqs?.length || 0})</h3>
                    <div className="space-y-4">
                      {faqContent.faqs && faqContent.faqs.length > 0 ? (
                        faqContent.faqs.map((faq, index) => (
                          <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg"
                          >
                            <h4 className="font-medium mb-2">{faq.question}</h4>
                            <div
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                              className="text-sm text-gray-600"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No FAQs added yet.</p>
                      )}
                    </div>
                  </div>

                  {faqContent.lastUpdated && (
                    <div className="text-right absolute bottom-4 right-6">
                      <span className="text-sm text-gray-500">
                        Updated: {formatDate(faqContent.lastUpdated)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={faqContent.title}
                      onChange={(e) =>
                        setFaqContent({ ...faqContent, title: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <Input
                      value={faqContent.subTitle}
                      onChange={(e) =>
                        setFaqContent({ ...faqContent, subTitle: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Add/Edit FAQ Form */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">
                      {editingFAQIndex !== null ? "Edit FAQ" : "Add New FAQ"}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Question</label>
                        <Input
                          value={newFAQ.question}
                          onChange={(e) =>
                            setNewFAQ({ ...newFAQ, question: e.target.value })
                          }
                          placeholder="Enter question"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Answer</label>
                        <RichTextEditor
                          value={newFAQ.answer}
                          onChange={(value) => {
                            // Process HTML to ensure alignment styles are preserved
                            const processedValue = processAlignmentStyles(value);
                            setNewFAQ({ ...newFAQ, answer: processedValue });
                          }}
                          className="w-full bg-white text-gray-900"
                          controls={[
                            ['bold', 'italic', 'underline', 'strike'],
                            ['h1', 'h2', 'h3'],
                            ['unorderedList', 'orderedList'],
                            ['link', 'image', 'video'],
                            ['alignLeft', 'alignCenter', 'alignRight'],
                            ['blockquote', 'code'],
                            ['sup', 'sub'],
                            ['clean'],
                          ]}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            editingFAQIndex !== null ? updateFAQItem(editingFAQIndex) : addFAQ()
                          }
                          className="theme-button text-white"
                        >
                          {editingFAQIndex !== null ? "Update FAQ" : "Add FAQ"}
                        </Button>
                        {editingFAQIndex !== null && (
                          <Button
                            onClick={() => {
                              setEditingFAQIndex(null);
                              setNewFAQ({ question: "", answer: "" });
                            }}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* FAQs List */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">FAQs ({faqContent.faqs?.length || 0})</h3>
                    <div className="space-y-4">
                      {faqContent.faqs && faqContent.faqs.length > 0 ? (
                        faqContent.faqs.map((faq, index) => (
                          <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{faq.question}</h4>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => startEditFAQItem(index)}
                                  variant="outline"
                                  size="sm"
                                >
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => deleteFAQ(index)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                            <div
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                              className="text-sm text-gray-600"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No FAQs added yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={updateFAQ}
                      className="theme-button text-white"
                      disabled={savingContent}
                    >
                      {savingContent ? "Updating..." : "Update"}
                    </Button>
                    <Button
                      onClick={discardFAQ}
                      variant="outline"
                      disabled={savingContent}
                    >
                      Discard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}

      {/* Checkout Tab */}
      {activeTab === "checkout" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 theme-heading">Checkout options</h2>
            <p className="text-sm text-gray-600 mb-6">
              Enable or disable payment methods and charges. Users will see only enabled options in the checkout modal; orders will reflect these settings.
            </p>
            {checkoutLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">Cash on Delivery (COD)</p>
                    <p className="text-sm text-gray-500">Allow customers to pay when the order is delivered.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkoutSettings.codEnabled}
                      onChange={(e) => setCheckoutSettings((s) => ({ ...s, codEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--theme-primary)]" />
                  </label>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">Online payment</p>
                    <p className="text-sm text-gray-500">Allow Credit / Debit card payment.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkoutSettings.onlinePaymentEnabled}
                      onChange={(e) => setCheckoutSettings((s) => ({ ...s, onlinePaymentEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--theme-primary)]" />
                  </label>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">Tax</p>
                    <p className="text-sm text-gray-500">Apply tax to order total (percentage).</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkoutSettings.taxEnabled}
                      onChange={(e) => setCheckoutSettings((s) => ({ ...s, taxEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--theme-primary)]" />
                  </label>
                </div>
                {checkoutSettings.taxEnabled && (
                  <div className="pl-4">
                    <label className="block text-sm font-medium mb-1">Tax rate (%)</label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={checkoutSettings.taxRate}
                      onChange={(e) => setCheckoutSettings((s) => ({ ...s, taxRate: Number(e.target.value) || 0 }))}
                      className="w-32"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">Shipping charges</p>
                    <p className="text-sm text-gray-500">Add a fixed shipping amount to each order.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkoutSettings.shippingEnabled}
                      onChange={(e) => setCheckoutSettings((s) => ({ ...s, shippingEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--theme-primary)]" />
                  </label>
                </div>
                {checkoutSettings.shippingEnabled && (
                  <div className="pl-4">
                    <label className="block text-sm font-medium mb-1">Shipping amount</label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={checkoutSettings.shippingCharges}
                      onChange={(e) => setCheckoutSettings((s) => ({ ...s, shippingCharges: Number(e.target.value) || 0 }))}
                      className="w-32"
                    />
                  </div>
                )}
                <div className="pt-4">
                  <Button
                    onClick={saveCheckoutSettings}
                    disabled={checkoutSaving}
                    className="theme-button text-white"
                  >
                    {checkoutSaving ? "Saving..." : "Save checkout settings"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showImageCropper && currentBannerSlot && currentImageFile && (
        <ImageCropperModal
          open={showImageCropper}
          onClose={() => {
            setShowImageCropper(false);
            setCurrentBannerSlot(null);
            setCurrentImageFile(null);
          }}
          file={currentImageFile}
          onCropDone={async (croppedBlob: Blob) => {
            const croppedFile = new File([croppedBlob], currentImageFile.name, { type: croppedBlob.type });
            handleImageCrop(croppedFile);
          }}
          aspect={BANNER_CONFIG[currentBannerSlot].aspect}
        />
      )}
    </div>
  );
}
