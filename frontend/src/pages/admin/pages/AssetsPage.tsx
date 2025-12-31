import React, { useEffect, useState } from "react";
import { RichTextEditor } from "@mantine/rte";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAllContent, updateContent, type ContentPage, type FAQ } from "@/api/content.api";
import { getBanners, updateBanner, type Banner, type BannerSlot } from "@/api/banner.api";
import { useToast } from "@/components/ui/toast";
import PageLoader from "@/components/ui/PageLoader";
import ImageCropperModal from "@/components/admin/product/ImageCropperModal";
import { Upload, X } from "lucide-react";

export default function AssetsPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Content states
  const [privacyContent, setPrivacyContent] = useState<ContentPage>({
    type: "privacy",
    title: "Privacy Policy",
    subTitle: "",
    description: "",
    lastUpdated: "",
  });
  
  const [termsContent, setTermsContent] = useState<ContentPage>({
    type: "terms",
    title: "Terms & Conditions",
    subTitle: "",
    description: "",
    lastUpdated: "",
  });
  
  const [faqsContent, setFaqsContent] = useState<ContentPage>({
    type: "faqs",
    title: "Frequently Asked Questions",
    subTitle: "",
    description: "",
    faqs: [],
    lastUpdated: "",
  });

  // Banner states
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<BannerSlot | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [bannerTargetUrl, setBannerTargetUrl] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedFileForCrop, setSelectedFileForCrop] = useState<File | null>(null);
  const [savingBanner, setSavingBanner] = useState(false);

  // Editing states
  const [isPrivacyEditing, setIsPrivacyEditing] = useState(false);
  const [isTermsEditing, setIsTermsEditing] = useState(false);
  const [isFaqsEditing, setIsFaqsEditing] = useState(false);

  // Original content for discard
  const [privacyOriginal, setPrivacyOriginal] = useState<ContentPage | null>(null);
  const [termsOriginal, setTermsOriginal] = useState<ContentPage | null>(null);
  const [faqsOriginal, setFaqsOriginal] = useState<ContentPage | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [allContent, allBanners] = await Promise.all([
        getAllContent().catch(() => []),
        getBanners().catch(() => [])
      ]);
      
      const privacy = allContent.find((c) => c.type === "privacy");
      const terms = allContent.find((c) => c.type === "terms");
      const faqs = allContent.find((c) => c.type === "faqs");

      if (privacy) {
        setPrivacyContent(privacy);
      }
      if (terms) {
        setTermsContent(terms);
      }
      if (faqs) {
        setFaqsContent(faqs);
      }

      setBanners(allBanners);
    } catch (err) {
      console.error("Failed to load assets", err);
      error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not updated";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  // Banner handlers
  const handleBannerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFileForCrop(file);
    setCropModalOpen(true);
  };

  const getBannerAspectRatio = (slot: BannerSlot): number => {
    // hero-main: full background banner - 16:9
    if (slot === "hero-main") return 16 / 9;
    // hero-secondary: side image banner - 1.6:1
    if (slot === "hero-secondary") return 1.6;
    // hero-tertiary: wide banner - 16:9
    if (slot === "hero-tertiary") return 16 / 9;
    // shop-main: wide banner - 16:9
    if (slot === "shop-main") return 16 / 9;
    return 16 / 9; // default
  };

  const getCurrentBannerAspect = () => {
    if (!editingBanner) return 16 / 9;
    return getBannerAspectRatio(editingBanner);
  };

  const handleCropDone = (blob: Blob) => {
    const file = new File([blob], "banner.jpg", { type: "image/jpeg" });
    setBannerImageFile(file);
    setBannerImagePreview(URL.createObjectURL(blob));
    setCropModalOpen(false);
  };

  const handleEditBanner = (slot: BannerSlot) => {
    const banner = banners.find((b) => b.slot === slot);
    setEditingBanner(slot);
    setBannerTargetUrl(banner?.targetUrl || "");
    setBannerImageFile(null);
    setBannerImagePreview(banner?.imageUrl || null);
  };

  const handleCancelBanner = () => {
    setEditingBanner(null);
    setBannerTargetUrl("");
    setBannerImageFile(null);
    setBannerImagePreview(null);
  };

  const handleSaveBanner = async () => {
    if (!editingBanner) return;
    
    try {
      setSavingBanner(true);
      await updateBanner(editingBanner, {
        targetUrl: bannerTargetUrl,
        file: bannerImageFile,
      });
      success("Banner updated successfully!");
      handleCancelBanner();
      loadAll();
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update banner");
    } finally {
      setSavingBanner(false);
    }
  };

  const getBannerSlotLabel = (slot: BannerSlot): string => {
    const labels: Record<BannerSlot, string> = {
      "hero-main": "Hero Main",
      "hero-secondary": "Hero Secondary",
      "hero-tertiary": "Hero Tertiary",
      "shop-main": "Shop Main",
    };
    return labels[slot] || slot;
  };

  // Privacy handlers
  const handleEditPrivacy = () => {
    setPrivacyOriginal({ ...privacyContent });
    setIsPrivacyEditing(true);
  };

  const handleDiscardPrivacy = () => {
    if (privacyOriginal) {
      setPrivacyContent(privacyOriginal);
    }
    setIsPrivacyEditing(false);
    setPrivacyOriginal(null);
  };

  const handleSavePrivacy = async () => {
    try {
      await updateContent("privacy", {
        title: privacyContent.title,
        subTitle: privacyContent.subTitle,
        description: privacyContent.description,
      });
      success("Privacy Policy updated successfully!");
      setIsPrivacyEditing(false);
      setPrivacyOriginal(null);
      loadAll();
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update Privacy Policy");
    }
  };

  // Terms handlers
  const handleEditTerms = () => {
    setTermsOriginal({ ...termsContent });
    setIsTermsEditing(true);
  };

  const handleDiscardTerms = () => {
    if (termsOriginal) {
      setTermsContent(termsOriginal);
    }
    setIsTermsEditing(false);
    setTermsOriginal(null);
  };

  const handleSaveTerms = async () => {
    try {
      await updateContent("terms", {
        title: termsContent.title,
        subTitle: termsContent.subTitle,
        description: termsContent.description,
      });
      success("Terms & Conditions updated successfully!");
      setIsTermsEditing(false);
      setTermsOriginal(null);
      loadAll();
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update Terms & Conditions");
    }
  };

  // FAQs handlers
  const handleEditFaqs = () => {
    setFaqsOriginal({ ...faqsContent });
    setIsFaqsEditing(true);
  };

  const handleDiscardFaqs = () => {
    if (faqsOriginal) {
      setFaqsContent(faqsOriginal);
    }
    setIsFaqsEditing(false);
    setFaqsOriginal(null);
  };

  const handleSaveFaqs = async () => {
    try {
      await updateContent("faqs", {
        title: faqsContent.title,
        subTitle: faqsContent.subTitle,
        description: faqsContent.description,
        faqs: faqsContent.faqs || [],
      });
      success("FAQs updated successfully!");
      setIsFaqsEditing(false);
      setFaqsOriginal(null);
      loadAll();
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update FAQs");
    }
  };

  const addFAQ = () => {
    setFaqsContent({
      ...faqsContent,
      faqs: [...(faqsContent.faqs || []), { question: "", answer: "" }],
    });
  };

  const removeFAQ = (index: number) => {
    const newFaqs = [...(faqsContent.faqs || [])];
    newFaqs.splice(index, 1);
    setFaqsContent({ ...faqsContent, faqs: newFaqs });
  };

  const updateFAQ = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...(faqsContent.faqs || [])];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqsContent({ ...faqsContent, faqs: newFaqs });
  };

  if (loading) {
    return <PageLoader message="Loading assets..." />;
  }

  const landingPageBanners: BannerSlot[] = ["hero-main", "hero-secondary", "hero-tertiary"];
  const shopPageBanners: BannerSlot[] = ["shop-main"];

  const renderBannerCard = (slot: BannerSlot) => {
    const banner = banners.find((b) => b.slot === slot);
    const isEditing = editingBanner === slot;

    return (
      <div key={slot} className="bg-white rounded-lg border border-gray-200 p-6 text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">{getBannerSlotLabel(slot)}</h2>
          {!isEditing ? (
            <Button onClick={() => handleEditBanner(slot)} className="theme-button text-black">
              {banner ? "Edit" : "Add Banner"}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancelBanner} variant="outline" className="text-black">
                Cancel
              </Button>
              <Button onClick={handleSaveBanner} className="theme-button text-black" disabled={savingBanner}>
                {savingBanner ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black">Banner Image</label>
              <div className="flex items-center gap-4">
                {bannerImagePreview && (
                  <div className="relative">
                    <img
                      src={bannerImagePreview}
                      alt="Banner preview"
                      className="w-48 h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={() => {
                        setBannerImagePreview(null);
                        setBannerImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerFileSelect}
                    className="hidden"
                    id={`banner-file-${slot}`}
                  />
                  <label
                    htmlFor={`banner-file-${slot}`}
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-black"
                  >
                    <Upload className="w-4 h-4" />
                    {bannerImagePreview ? "Change Image" : "Upload Image"}
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-black">Target URL (optional)</label>
              <Input
                placeholder="https://example.com or /shop"
                value={bannerTargetUrl}
                onChange={(e) => setBannerTargetUrl(e.target.value)}
                className="text-black"
              />
            </div>
          </div>
        ) : (
          <div>
            {banner?.imageUrl ? (
              <div>
                <img
                  src={banner.imageUrl}
                  alt={getBannerSlotLabel(slot)}
                  className="w-full h-auto object-cover rounded-lg border border-gray-300"
                />
                {banner.targetUrl && (
                  <p className="mt-2 text-sm text-black">
                    Target URL: <a href={banner.targetUrl} className="text-blue-600 hover:underline">{banner.targetUrl}</a>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-black italic">No banner set for this slot</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold theme-heading mb-6 text-black">Assets Panel</h1>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="banners" className="text-black">Banners</TabsTrigger>
          <TabsTrigger value="privacy" className="text-black">Privacy Policy</TabsTrigger>
          <TabsTrigger value="terms" className="text-black">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="faqs" className="text-black">FAQs</TabsTrigger>
        </TabsList>

        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-8 mt-6">
          {/* Landing Page Banners */}
          <div>
            <h2 className="text-xl font-bold text-black mb-4">Landing Page Banners</h2>
            <div className="space-y-6">
              {landingPageBanners.map((slot) => renderBannerCard(slot))}
            </div>
          </div>

          {/* Shop Page Banners */}
          <div>
            <h2 className="text-xl font-bold text-black mb-4">Shop Page Banners</h2>
            <div className="space-y-6">
              {shopPageBanners.map((slot) => renderBannerCard(slot))}
            </div>
          </div>
        </TabsContent>

        {/* Privacy Policy Tab */}
        <TabsContent value="privacy" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-black">Privacy Policy</h2>
              {!isPrivacyEditing ? (
                <Button onClick={handleEditPrivacy} className="theme-button text-white">
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleDiscardPrivacy} variant="outline">
                    Discard
                  </Button>
                  <Button onClick={handleSavePrivacy} className="theme-button text-white">
                    Update
                  </Button>
                </div>
              )}
            </div>

            {isPrivacyEditing ? (
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={privacyContent.title}
                  onChange={(e) => setPrivacyContent({ ...privacyContent, title: e.target.value })}
                />
                <Input
                  placeholder="Subtitle"
                  value={privacyContent.subTitle}
                  onChange={(e) => setPrivacyContent({ ...privacyContent, subTitle: e.target.value })}
                />
                <RichTextEditor
                  value={privacyContent.description}
                  onChange={(value) => setPrivacyContent({ ...privacyContent, description: value })}
                  className="w-full bg-white text-gray-900"
                />
              </div>
            ) : (
              <div className="text-black">
                <div dangerouslySetInnerHTML={{ __html: privacyContent.description }} />
                <div className="flex justify-end mt-4 text-sm text-black">
                  Last updated {formatDate(privacyContent.lastUpdated)}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Terms & Conditions Tab */}
        <TabsContent value="terms" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-black">Terms & Conditions</h2>
              {!isTermsEditing ? (
                <Button onClick={handleEditTerms} className="theme-button text-white">
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleDiscardTerms} variant="outline">
                    Discard
                  </Button>
                  <Button onClick={handleSaveTerms} className="theme-button text-white">
                    Update
                  </Button>
                </div>
              )}
            </div>

            {isTermsEditing ? (
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={termsContent.title}
                  onChange={(e) => setTermsContent({ ...termsContent, title: e.target.value })}
                />
                <Input
                  placeholder="Subtitle"
                  value={termsContent.subTitle}
                  onChange={(e) => setTermsContent({ ...termsContent, subTitle: e.target.value })}
                />
                <RichTextEditor
                  value={termsContent.description}
                  onChange={(value) => setTermsContent({ ...termsContent, description: value })}
                  className="w-full bg-white text-gray-900"
                />
              </div>
            ) : (
              <div className="text-black">
                <div dangerouslySetInnerHTML={{ __html: termsContent.description }} />
                <div className="flex justify-end mt-4 text-sm text-black">
                  Last updated {formatDate(termsContent.lastUpdated)}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-black">Frequently Asked Questions</h2>
              {!isFaqsEditing ? (
                <Button onClick={handleEditFaqs} className="theme-button text-white">
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleDiscardFaqs} variant="outline">
                    Discard
                  </Button>
                  <Button onClick={handleSaveFaqs} className="theme-button text-white">
                    Update
                  </Button>
                </div>
              )}
            </div>

            {isFaqsEditing ? (
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={faqsContent.title}
                  onChange={(e) => setFaqsContent({ ...faqsContent, title: e.target.value })}
                />
                <Input
                  placeholder="Subtitle"
                  value={faqsContent.subTitle}
                  onChange={(e) => setFaqsContent({ ...faqsContent, subTitle: e.target.value })}
                />
                <div className="space-y-4">
                  {(faqsContent.faqs || []).map((faq, index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-2">
                      <Input
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, "question", e.target.value)}
                      />
                      <RichTextEditor
                        value={faq.answer}
                        onChange={(value) => updateFAQ(index, "answer", value)}
                        className="w-full bg-white text-gray-900"
                      />
                      <Button
                        onClick={() => removeFAQ(index)}
                        variant="outline"
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addFAQ} variant="outline">
                    + Add FAQ
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-black">
                <div className="space-y-4">
                  {(faqsContent.faqs || []).map((faq, index) => (
                    <div key={index} className="border-b pb-4">
                      <h3 className="font-semibold mb-2 text-black">{faq.question}</h3>
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4 text-sm text-black">
                  Last updated {formatDate(faqsContent.lastUpdated)}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <ImageCropperModal
        open={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        file={selectedFileForCrop}
        onCropDone={handleCropDone}
        aspect={getCurrentBannerAspect()}
      />
    </div>
  );
}
