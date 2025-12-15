import React, { useEffect, useState } from "react";
import ImageCropperModal from "@/components/admin/product/ImageCropperModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getBanners, updateBanner, type Banner, type BannerSlot } from "@/api/banner.api";

// Small helper type describing one banner "slot" on the page
interface BannerSlotConfig {
  id: BannerSlot | string;
  label: string;
  // Human‑friendly description so you remember where it shows
  description: string;
  // Recommended aspect ratio for the cropper (width / height)
  aspect: number;
}

// We will manage 4 banner positions, similar to your screenshot.
const BANNER_SLOTS: BannerSlotConfig[] = [
  {
    id: "hero-main",
    label: "Hero Banner",
    description: "Large banner on the Landing page hero section.",
    // Very wide hero. You can tweak this later if you like.
    aspect: 16 / 5,
  },
  {
    id: "hero-secondary",
    label: "Secondary Banner",
    description: "Second banner on the admin Assets page. Use wherever you want later.",
    aspect: 16 / 6,
  },
  {
    id: "hero-tertiary",
    label: "Third Banner",
    description: "Third banner on the admin Assets page. Optional usage.",
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

// Admin Assets page – for now we only implement the "Banners" tab.
const AssetsPage: React.FC = () => {
  const [banners, setBanners] = useState<Record<string, BannerState>>({});

  // Cropper state (re‑used for all banners)
  const [cropOpen, setCropOpen] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropAspect, setCropAspect] = useState(1);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  // -------- 1. Load existing banners from backend on mount --------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBanners();

        // Convert array from backend into a record keyed by slot id.
        const initial: Record<string, BannerState> = {};
        BANNER_SLOTS.forEach((slot) => {
          const found = data.find((b) => b.slot === slot.id);
          initial[slot.id] = {
            imageUrl: found?.imageUrl || "", // empty means "no banner yet"
            targetUrl: found?.targetUrl || "",
            loading: false,
          };
        });
        setBanners(initial);
      } catch (err) {
        console.error("Failed to load banners", err);
      }
    };

    load();
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

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Assets Panel</h1>
          <p className="text-sm text-gray-500">
            Manage banners that appear on your Landing and Shop pages.
          </p>
        </div>
      </div>

      {/* Tabs container – for now we only have a single tab named 'Banners'.
          Later you can add more tabs here (e.g. 'Company Info', 'FAQ', etc.). */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b px-6 py-3 flex gap-4">
          <button className="text-sm font-medium text-[#A8734B] border-b-2 border-[#A8734B] pb-1">
            Banners
          </button>
          {/* Example of future tabs:
          <button className="text-sm text-gray-500 hover:text-gray-700">
            Company
          </button>
          */}
        </div>

        <div className="p-6 space-y-6">
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
                <div className="w-full h-48 bg-white rounded-lg border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
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
                      className="bg-[#C69C6D] hover:bg-[#b88b5f] text-white"
                      onClick={() => handleSaveBanner(slot.id)}
                      disabled={state.loading}
                    >
                      {state.loading ? "Saving..." : "Save Banner"}
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
        </div>
      </div>

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


