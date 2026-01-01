import React, { useState, useEffect } from "react";
import { RichTextEditor } from "@mantine/rte";
import { getBanners, updateBanner, type Banner, type BannerSlot } from "@/api/banner.api";
import { getAllContent, updateContent, getContentByType, type ContentPage, type ContentType } from "@/api/content.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import FilterTabs from "@/components/ui/FilterTabs";
import ImageCropperModal from "@/components/admin/product/ImageCropperModal";

type TabType = "banners" | "privacy" | "terms" | "faq";

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
  const [bannerFormData, setBannerFormData] = useState<Record<BannerSlot, { targetUrl: string; imageFile: File | null; imagePreview: string | null }>>({
    "hero-main": { targetUrl: "", imageFile: null, imagePreview: null },
    "hero-secondary": { targetUrl: "", imageFile: null, imagePreview: null },
    "hero-tertiary": { targetUrl: "", imageFile: null, imagePreview: null },
    "shop-main": { targetUrl: "", imageFile: null, imagePreview: null },
  });
  const [bannerOriginalData, setBannerOriginalData] = useState<Record<BannerSlot, { targetUrl: string; imageFile: File | null; imagePreview: string | null }>>({
    "hero-main": { targetUrl: "", imageFile: null, imagePreview: null },
    "hero-secondary": { targetUrl: "", imageFile: null, imagePreview: null },
    "hero-tertiary": { targetUrl: "", imageFile: null, imagePreview: null },
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

  const loadBanners = async () => {
    setBannerLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
      // Initialize form data with existing banners
      const initialData: Record<BannerSlot, { targetUrl: string; imageFile: File | null; imagePreview: string | null }> = {
        "hero-main": { targetUrl: "", imageFile: null, imagePreview: null },
        "hero-secondary": { targetUrl: "", imageFile: null, imagePreview: null },
        "hero-tertiary": { targetUrl: "", imageFile: null, imagePreview: null },
        "shop-main": { targetUrl: "", imageFile: null, imagePreview: null },
      };
      data.forEach((banner) => {
        if (banner.slot in initialData) {
          initialData[banner.slot as BannerSlot] = {
            targetUrl: banner.targetUrl || "",
            imageFile: null,
            imagePreview: banner.imageUrl,
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
      await updateBanner(slot, {
        targetUrl: bannerFormData[slot].targetUrl,
        file: bannerFormData[slot].imageFile,
      });
      success("Banner updated successfully!");
      setEditingBannerSlot(null);
      setBannerFormData({
        ...bannerFormData,
        [slot]: {
          ...bannerFormData[slot],
          imageFile: null,
        },
      });
      loadBanners();
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update banner");
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
      await updateContent("privacy", {
        title: privacyContent.title,
        subTitle: privacyContent.subTitle,
        description: privacyContent.description,
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
      await updateContent("terms", {
        title: termsContent.title,
        subTitle: termsContent.subTitle,
        description: termsContent.description,
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
      await updateContent("faqs", {
        title: faqContent.title,
        subTitle: faqContent.subTitle,
        description: faqContent.description,
        faqs: faqContent.faqs || [],
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

  const bannerSlots: { slot: BannerSlot; label: string }[] = [
    { slot: "hero-main", label: "Hero Main" },
    { slot: "hero-secondary", label: "Hero Secondary" },
    { slot: "hero-tertiary", label: "Hero Tertiary" },
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
        <h1 className="text-2xl font-semibold theme-heading">Assets</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <FilterTabs
          tabs={[
            { id: "banners", label: "Banners" },
            { id: "privacy", label: "Privacy Policy" },
            { id: "terms", label: "Terms & Conditions" },
            { id: "faq", label: "FAQ" },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabType)}
        />
      </div>

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
                                className="w-full h-64 object-cover rounded border hover:opacity-90 transition-opacity"
                              />
                            </a>
                          ) : (
                            <img
                              src={imageUrl}
                              alt={label}
                              className="w-full h-64 object-cover rounded border"
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
                        <label className="block text-sm font-medium mb-2">Banner Image</label>
                        {formData.imagePreview ? (
                          <div className="relative">
                            <img
                              src={formData.imagePreview}
                              alt="Preview"
                              className="w-full h-64 object-cover rounded border"
                            />
                            <button
                              onClick={() => {
                                setBannerFormData({
                                  ...bannerFormData,
                                  [slot]: {
                                    ...formData,
                                    imagePreview: banner?.imageUrl || null,
                                    imageFile: null,
                                  },
                                });
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Remove
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
                    className="prose max-w-none"
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
                      onChange={(value) =>
                        setPrivacyContent({ ...privacyContent, description: value })
                      }
                      className="w-full bg-white text-gray-900"
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
                    className="prose max-w-none"
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
                      onChange={(value) =>
                        setTermsContent({ ...termsContent, description: value })
                      }
                      className="w-full bg-white text-gray-900"
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
                          onChange={(value) =>
                            setNewFAQ({ ...newFAQ, answer: value })
                          }
                          className="w-full bg-white text-gray-900"
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

      {/* Image Cropper Modal */}
      {showImageCropper && currentBannerSlot && currentImageFile && (
        <ImageCropperModal
          open={showImageCropper}
          onClose={() => {
            setShowImageCropper(false);
            setCurrentBannerSlot(null);
            setCurrentImageFile(null);
          }}
          imageFile={currentImageFile}
          onCrop={handleImageCrop}
          aspectRatio={16 / 9}
        />
      )}
    </div>
  );
}
