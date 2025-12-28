import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageCropperModal from "@/components/admin/product/ImageCropperModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@mantine/rte";
import { getBanners, updateBanner, type BannerSlot } from "@/api/banner.api";
import { getAllContent, updateContent, type ContentPage, type FAQ } from "@/api/content.api";
import { useToast } from "@/components/ui/toast";
import PageLoader from "@/components/ui/PageLoader";

// -------------------- CONFIG: Banner slots --------------------
// Each slot connects admin UI → backend → Landing/Shop components.
interface BannerSlotConfig {
  id: BannerSlot | string;
  label: string;
  // Where this banner is used in the frontend (for your understanding)
  description: string;
  // Recommended aspect ratio for the cropper (width / height)
  aspect: number;
}

// 3 banners on Landing page + 1 banner on Shop page
const BANNER_SLOTS: BannerSlotConfig[] = [
  {
    id: "hero-main",
    label: "Landing Hero (Top)",
    description: "Big hero background at the top of the Landing page.",
    aspect: 16 / 5,
  },
  {
    id: "hero-secondary",
    label: "Landing Hero 2",
    description: "Image used in the middle Hero2 section on the Landing page.",
    aspect: 16 / 6,
  },
  {
    id: "hero-tertiary",
    label: "Landing Feature Hero",
    description: "Wide image used in the FeatureHero section on the Landing page.",
    aspect: 16 / 6,
  },
  {
    id: "shop-main",
    label: "Shop Banner",
    description: "Banner shown at the top of the Shop page.",
    aspect: 16 / 5,
  },
];

// Local UI state for each banner slot
interface BannerState {
  imageUrl: string; // preview in the admin UI
  targetUrl: string;
  file?: File | null; // cropped file ready to send to backend
  loading: boolean;
  error?: string;
}

// -------------------- MAIN COMPONENT --------------------
const AssetsPage: React.FC = () => {
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Record<string, BannerState>>({});

  // Cropper state (re‑used for all banners)
  const [cropOpen, setCropOpen] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropAspect, setCropAspect] = useState(1);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  // Content pages state (Privacy, Terms, FAQs)
  const [privacyContent, setPrivacyContent] = useState({ title: "", subTitle: "", description: "", lastUpdated: "", loading: false });
  const [termsContent, setTermsContent] = useState({ title: "", subTitle: "", description: "", lastUpdated: "", loading: false });
  const [faqsContent, setFaqsContent] = useState<{ faqs: FAQ[]; lastUpdated: string; loading: boolean }>({ faqs: [], lastUpdated: "", loading: false });
  const [addingFAQ, setAddingFAQ] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Edit mode states
  const [isPrivacyEditing, setIsPrivacyEditing] = useState(false);
  const [isTermsEditing, setIsTermsEditing] = useState(false);
  const [isFaqsEditing, setIsFaqsEditing] = useState(false);
  const [privacyOriginalContent, setPrivacyOriginalContent] = useState({ title: "", subTitle: "", description: "" });
  const [termsOriginalContent, setTermsOriginalContent] = useState({ title: "", subTitle: "", description: "" });
  const [faqsOriginalContent, setFaqsOriginalContent] = useState<FAQ[]>([]);

  // -------- 1. Load existing banners and content from backend on mount --------
  useEffect(() => {
    const loadAll = async () => {
      setInitialLoading(true);
      try {
        // Load banners and content in parallel
        const [bannersData, contents] = await Promise.all([
          getBanners(),
          getAllContent().catch(() => [])
        ]);

        // Process banners
        const initial: Record<string, BannerState> = {};
        BANNER_SLOTS.forEach((slot) => {
          const found = bannersData.find((b) => b.slot === slot.id);
          initial[slot.id] = {
            imageUrl: found?.imageUrl || "",
            targetUrl: found?.targetUrl || "",
            loading: false,
          };
        });
        setBanners(initial);
        
        // Process content pages
        const privacy = contents.find(c => c.type === "privacy");
        const terms = contents.find(c => c.type === "terms");
        const faqs = contents.find(c => c.type === "faqs");
        
        if (privacy) {
          setPrivacyContent({
            title: privacy.title || "",
            subTitle: privacy.subTitle || "",
            description: privacy.description || "",
            lastUpdated: privacy.lastUpdated || "",
            loading: false
          });
        }
        
        if (terms) {
          setTermsContent({
            title: terms.title || "",
            subTitle: terms.subTitle || "",
            description: terms.description || "",
            lastUpdated: terms.lastUpdated || "",
            loading: false
          });
        }
        
        if (faqs) {
          setFaqsContent({
            faqs: faqs.faqs || [],
            lastUpdated: faqs.lastUpdated || "",
            loading: false
          });
        }
      } catch (err) {
        console.error("Failed to load assets", err);
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadAll();
  }, []);

  // -------- 2. When user picks a file for a banner slot --------
  const handleSelectFile = (slotId: string, file?: File | null) => {
    if (!file) return;

    // Remember which slot we are editing, and open the cropper.
    setActiveSlotId(slotId);
    setCropFile(file);

    // Use the aspect ratio configured for this slot.
    const config = BANNER_SLOTS.find((s) => s.id === slotId);
    setCropAspect(config?.aspect ?? 1);

    setCropOpen(true);
  };

  // -------- 3. When cropper finishes --------
  const handleCropDone = (blob: Blob) => {
    if (!activeSlotId) return;

    // Turn the cropped Blob back into a File so we can send it via FormData.
    const file = new File([blob], "banner.jpg", { type: "image/jpeg" });
    const previewUrl = URL.createObjectURL(file);

    setBanners((prev) => ({
      ...prev,
      [activeSlotId]: {
        ...(prev[activeSlotId] || { loading: false }),
        file,
        imageUrl: previewUrl, // show cropped preview in card
        error: undefined,
      },
    }));

    setCropOpen(false);
    setCropFile(null);
    setActiveSlotId(null);
  };

  // -------- 4. Save / Update one banner to backend --------
  const handleSaveBanner = async (slotId: string) => {
    const state = banners[slotId];
    if (!state) return;

    if (!state.file && !state.imageUrl) {
      // For a brand‑new banner we require an image.
      setBanners((prev) => ({
        ...prev,
        [slotId]: {
          ...state,
          error: "Please select and crop a banner image before saving.",
        },
      }));
      return;
    }

    try {
      setBanners((prev) => ({
        ...prev,
        [slotId]: { ...prev[slotId], loading: true, error: undefined },
      }));

      const updated = await updateBanner(slotId, {
        targetUrl: state.targetUrl,
        file: state.file || undefined, // if no new file, backend keeps old image
      });

      setBanners((prev) => ({
        ...prev,
        [slotId]: {
          ...prev[slotId],
          imageUrl: updated.imageUrl,
          targetUrl: updated.targetUrl,
          file: undefined, // reset file after successful upload
          loading: false,
        },
      }));
    } catch (err: any) {
      console.error("Failed to save banner", err);
      setBanners((prev) => ({
        ...prev,
        [slotId]: {
          ...prev[slotId],
          loading: false,
          error: err?.response?.data?.message || "Failed to save banner.",
        },
      }));
    }
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  // Privacy Policy handlers
  const handleEditPrivacy = () => {
    setPrivacyOriginalContent({
      title: privacyContent.title,
      subTitle: privacyContent.subTitle,
      description: privacyContent.description
    });
    setIsPrivacyEditing(true);
  };

  const handleDiscardPrivacy = () => {
    setPrivacyContent({
      ...privacyContent,
      title: privacyOriginalContent.title,
      subTitle: privacyOriginalContent.subTitle,
      description: privacyOriginalContent.description
    });
    setIsPrivacyEditing(false);
  };

  const handleSavePrivacy = async () => {
    try {
      setPrivacyContent(prev => ({ ...prev, loading: true }));
      const updated = await updateContent("privacy", {
        title: privacyContent.title,
        subTitle: privacyContent.subTitle,
        description: privacyContent.description
      });
      // Reload content to get the latest data including lastUpdated
      const contents = await getAllContent();
      const privacy = contents.find(c => c.type === "privacy");
      if (privacy) {
        setPrivacyContent({
          title: privacy.title || "",
          subTitle: privacy.subTitle || "",
          description: privacy.description || "",
          lastUpdated: privacy.lastUpdated || "",
          loading: false
        });
      }
      setIsPrivacyEditing(false);
      success("Privacy Policy updated successfully!");
    } catch (err: any) {
      console.error("Failed to save privacy policy", err);
      setPrivacyContent(prev => ({ ...prev, loading: false }));
      error("Failed to save: " + (err?.response?.data?.message || err.message));
    }
  };

  // Terms & Conditions handlers
  const handleEditTerms = () => {
    setTermsOriginalContent({
      title: termsContent.title,
      subTitle: termsContent.subTitle,
      description: termsContent.description
    });
    setIsTermsEditing(true);
  };

  const handleDiscardTerms = () => {
    setTermsContent({
      ...termsContent,
      title: termsOriginalContent.title,
      subTitle: termsOriginalContent.subTitle,
      description: termsOriginalContent.description
    });
    setIsTermsEditing(false);
  };

  const handleSaveTerms = async () => {
    try {
      setTermsContent(prev => ({ ...prev, loading: true }));
      const updated = await updateContent("terms", {
        title: termsContent.title,
        subTitle: termsContent.subTitle,
        description: termsContent.description
      });
      // Reload content to get the latest data including lastUpdated
      const contents = await getAllContent();
      const terms = contents.find(c => c.type === "terms");
      if (terms) {
        setTermsContent({
          title: terms.title || "",
          subTitle: terms.subTitle || "",
          description: terms.description || "",
          lastUpdated: terms.lastUpdated || "",
          loading: false
        });
      }
      setIsTermsEditing(false);
      success("Terms & Conditions updated successfully!");
    } catch (err: any) {
      console.error("Failed to save terms", err);
      setTermsContent(prev => ({ ...prev, loading: false }));
      error("Failed to save: " + (err?.response?.data?.message || err.message));
    }
  };

  // FAQs handlers
  const handleEditFAQs = () => {
    setFaqsOriginalContent([...faqsContent.faqs]);
    setIsFaqsEditing(true);
  };

  const handleDiscardFAQs = () => {
    setFaqsContent({
      ...faqsContent,
      faqs: [...faqsOriginalContent]
    });
    setIsFaqsEditing(false);
  };

  const handleSaveFAQs = async () => {
    try {
      setFaqsContent(prev => ({ ...prev, loading: true }));
      await updateContent("faqs", {
        title: "Frequently Asked Questions",
        subTitle: "",
        description: "",
        faqs: faqsContent.faqs
      });
      // Reload content to get the latest data including lastUpdated
      const contents = await getAllContent();
      const faqs = contents.find(c => c.type === "faqs");
      if (faqs) {
        setFaqsContent({
          faqs: faqs.faqs || [],
          lastUpdated: faqs.lastUpdated || "",
          loading: false
        });
      }
      setIsFaqsEditing(false);
      success("FAQs updated successfully!");
    } catch (err: any) {
      console.error("Failed to save FAQs", err);
      setFaqsContent(prev => ({ ...prev, loading: false }));
      error("Failed to save: " + (err?.response?.data?.message || err.message));
    }
  };

  // Add new FAQ
  const handleAddFAQ = async () => {
    if (addingFAQ) return;
    setAddingFAQ(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      setFaqsContent(prev => ({
        ...prev,
        faqs: [...prev.faqs, { question: "", answer: "" }]
      }));
    } finally {
      setAddingFAQ(false);
    }
  };

  // Update FAQ
  const handleUpdateFAQ = (index: number, field: "question" | "answer", value: string) => {
    setFaqsContent(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => i === index ? { ...faq, [field]: value } : faq)
    }));
  };

  // Remove FAQ
  const handleRemoveFAQ = (index: number) => {
    setFaqsContent(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  if (initialLoading) {
    return <PageLoader message="Loading assets..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="theme-heading">Assets Panel</h1>
          <p className="text-sm text-gray-500">
            Manage banners, legal pages, and FAQs shown on your storefront.
          </p>
        </div>
      </div>

      {/* Tabs wrapper – "banners" is active by default */}
      <Tabs defaultValue="banners" className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200 px-6">
          {/* Tab buttons - styled as actual tabs with underline */}
          <TabsList className="bg-transparent h-auto p-0 gap-8 w-auto border-0">
            <TabsTrigger 
              value="banners"
              className="assets-tab-trigger"
            >
              Banners
            </TabsTrigger>
            <TabsTrigger 
              value="privacy"
              className="assets-tab-trigger"
            >
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger 
              value="terms"
              className="assets-tab-trigger"
            >
              Terms &amp; Conditions
            </TabsTrigger>
            <TabsTrigger 
              value="faqs"
              className="assets-tab-trigger"
            >
              FAQs
            </TabsTrigger>
          </TabsList>
        </div>

        {/* -------- TAB: BANNERS (current UI) -------- */}
        <TabsContent value="banners" className="p-6 space-y-6">
          {BANNER_SLOTS.map((slot) => {
            const state = banners[slot.id] || {
              imageUrl: "",
              targetUrl: "",
              loading: false,
            };

            return (
              <section
                key={slot.id}
                className="border rounded-lg p-4 bg-gray-50 space-y-4"
              >
                {/* Slot heading and helper text */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      {slot.label}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {slot.description} (Recommended aspect ratio:{" "}
                      {slot.aspect.toFixed(2)}:1)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="text-black"
                    size="sm"
                    onClick={() =>
                      document
                        .getElementById(`banner-file-${slot.id}`)
                        ?.click()
                    }
                  >
                    Choose Image
                  </Button>
                </div>

                {/* Hidden file input – triggers cropper when file is selected */}
                <input
                  id={`banner-file-${slot.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleSelectFile(slot.id, e.target.files?.[0] || null)
                  }
                />

                {/* Image preview box – tries to visually match your screenshot */}
                <div 
                  className={`w-full h-48 bg-white rounded-lg border border-dashed border-gray-300 flex items-center justify-center overflow-hidden ${
                    state.targetUrl && state.targetUrl.trim() !== "" ? "cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    if (state.targetUrl && state.targetUrl.trim() !== "") {
                      // Check if it's an external URL or internal route
                      if (state.targetUrl.startsWith("http://") || state.targetUrl.startsWith("https://")) {
                        window.open(state.targetUrl, "_blank");
                      } else {
                        navigate(state.targetUrl);
                      }
                    }
                  }}
                  title={state.targetUrl && state.targetUrl.trim() !== "" ? `Click to go to: ${state.targetUrl}` : ""}
                >
                  {state.imageUrl ? (
                    <img
                      src={state.imageUrl}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">
                      No image selected yet
                    </span>
                  )}
                </div>

                {/* Target URL input – where banner should link to */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Target URL
                    </label>
                    <Input
                      placeholder="https://example.com/special-offer"
                      value={state.targetUrl}
                      onChange={(e) =>
                        setBanners((prev) => ({
                          ...prev,
                          [slot.id]: {
                            ...(prev[slot.id] || {
                              imageUrl: "",
                              targetUrl: "",
                              loading: false,
                            }),
                            targetUrl: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex justify-end items-end">
                    <Button
                      className="theme-button"
                      onClick={() => handleSaveBanner(slot.id)}
                      loading={state.loading}
                    >
                      Save Banner
                    </Button>
                  </div>
                </div>

                {/* Error helper text */}
                {state.error && (
                  <p className="text-xs text-red-500">{state.error}</p>
                )}
              </section>
            );
          })}
        </TabsContent>

        {/* -------- TAB: PRIVACY POLICY -------- */}
        <TabsContent value="privacy" className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Privacy Policy</h2>
            {!isPrivacyEditing ? (
              <Button variant="outline" className="text-black" onClick={handleEditPrivacy}>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" className="text-black" onClick={handleDiscardPrivacy}>
                  Discard
                </Button>
                <Button 
                  className="theme-button" 
                  onClick={handleSavePrivacy}
                  loading={privacyContent.loading}
                >
                  Update
                </Button>
              </div>
            )}
          </div>

          {!isPrivacyEditing ? (
            <div className="bg-white border rounded-lg p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
                <div className="text-black py-2">{privacyContent.title || "placeholder"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sub Title</label>
                <div className="text-black py-2">{privacyContent.subTitle || "placeholder"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <div 
                  className="content-page text-gray-700 py-2"
                  dangerouslySetInnerHTML={{ __html: privacyContent.description || "<p>placeholder placeholder Desc Description Desc Description...</p>" }}
                />
              </div>
              <div className="flex justify-end">
                <div className="text-sm text-gray-700">
                  Last updated {formatDate(privacyContent.lastUpdated)}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
                <Input
                  placeholder="placeholder"
                  className="text-black"
                  value={privacyContent.title}
                  onChange={(e) => setPrivacyContent(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sub Title</label>
                <Input
                  placeholder="placeholder"
                  className="text-black"
                  value={privacyContent.subTitle}
                  onChange={(e) => setPrivacyContent(prev => ({ ...prev, subTitle: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <RichTextEditor
                  value={privacyContent.description}
                  onChange={(value) => setPrivacyContent(prev => ({ ...prev, description: value }))}
                  className="w-full bg-white text-gray-900 min-h-[300px]"
                  controls={[
                    ['bold', 'italic', 'underline'],
                    ['h1', 'h2', 'h3', 'h4'],
                    ['unorderedList', 'orderedList'],
                    ['alignLeft', 'alignCenter', 'alignRight'],
                    ['sup', 'sub'],
                  ]}
                />
              </div>
            </div>
          )}
        </TabsContent>

        {/* -------- TAB: TERMS & CONDITIONS -------- */}
        <TabsContent value="terms" className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Terms &amp; Conditions</h2>
            {!isTermsEditing ? (
              <Button variant="outline" className="text-black" onClick={handleEditTerms}>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" className="text-black" onClick={handleDiscardTerms}>
                  Discard
                </Button>
                <Button 
                  className="theme-button" 
                  onClick={handleSaveTerms}
                  loading={termsContent.loading}
                >
                  Update
                </Button>
              </div>
            )}
          </div>

          {!isTermsEditing ? (
            <div className="bg-white border rounded-lg p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
                <div className="text-black py-2">{termsContent.title || "placeholder"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sub Title</label>
                <div className="text-black py-2">{termsContent.subTitle || "placeholder"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <div 
                  className="content-page text-gray-700 py-2"
                  dangerouslySetInnerHTML={{ __html: termsContent.description || "<p>placeholder placeholder Desc Description Desc Description...</p>" }}
                />
              </div>
              <div className="flex justify-end">
                <div className="text-sm text-gray-700">
                  Last updated {formatDate(termsContent.lastUpdated)}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
                <Input
                  placeholder="placeholder"
                  className="text-black"
                  value={termsContent.title}
                  onChange={(e) => setTermsContent(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sub Title</label>
                <Input
                  placeholder="placeholder"
                  className="text-black"
                  value={termsContent.subTitle}
                  onChange={(e) => setTermsContent(prev => ({ ...prev, subTitle: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <RichTextEditor
                  value={termsContent.description}
                  onChange={(value) => setTermsContent(prev => ({ ...prev, description: value }))}
                  className="w-full bg-white text-gray-900 min-h-[300px]"
                  controls={[
                    ['bold', 'italic', 'underline'],
                    ['h1', 'h2', 'h3', 'h4'],
                    ['unorderedList', 'orderedList'],
                    ['alignLeft', 'alignCenter', 'alignRight'],
                    ['sup', 'sub'],
                  ]}
                />
              </div>
            </div>
          )}
        </TabsContent>

        {/* -------- TAB: FAQs -------- */}
        <TabsContent value="faqs" className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
            {!isFaqsEditing ? (
              <Button variant="outline" className="text-black" onClick={handleEditFAQs}>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" className="text-black" onClick={handleDiscardFAQs}>
                  Discard
                </Button>
                <Button 
                  className="theme-button" 
                  onClick={handleSaveFAQs}
                  loading={faqsContent.loading}
                >
                  Update
                </Button>
              </div>
            )}
          </div>

          {!isFaqsEditing ? (
            <div className="bg-white border rounded-lg p-6 space-y-4">
              {faqsContent.faqs.length > 0 ? (
                faqsContent.faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">FAQ #{index + 1}</span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Question</label>
                      <div className="text-black py-2">{faq.question || "placeholder"}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Answer</label>
                      <div 
                        className="content-page text-gray-700 py-2"
                        dangerouslySetInnerHTML={{ __html: faq.answer || "<p>placeholder</p>" }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No FAQs added yet.
                </p>
              )}
              <div className="flex justify-end">
                <div className="text-sm text-gray-700">
                  Last updated {formatDate(faqsContent.lastUpdated)}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-6 space-y-4">
              {faqsContent.faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">FAQ #{index + 1}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFAQ(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Question</label>
                  <Input
                    placeholder="Question Here Lorem ipsum dolor sit amet."
                    className="text-black"
                    value={faq.question}
                    onChange={(e) => handleUpdateFAQ(index, "question", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Answer</label>
                  <RichTextEditor
                    value={faq.answer}
                    onChange={(value) => handleUpdateFAQ(index, "answer", value)}
                    className="w-full bg-white text-gray-900 min-h-[150px]"
                    controls={[
                      ['bold', 'italic', 'underline'],
                      ['h1', 'h2', 'h3', 'h4'],
                      ['unorderedList', 'orderedList'],
                      ['alignLeft', 'alignCenter', 'alignRight'],
                      ['sup', 'sub'],
                    ]}
                  />
                </div>
              </div>
            ))}

              <Button variant="outline" onClick={handleAddFAQ} className="w-full text-black" loading={addingFAQ}>
                + Add FAQ
              </Button>

              {faqsContent.faqs.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No FAQs added yet. Click "+ Add FAQ" to create one.
                </p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Shared cropper modal – it uses the aspect ratio from the slot config */}
      <ImageCropperModal
        open={cropOpen}
        onClose={() => setCropOpen(false)}
        file={cropFile}
        onCropDone={handleCropDone}
        aspect={cropAspect}
      />
    </div>
  );
};

export default AssetsPage;



