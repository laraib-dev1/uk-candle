import React, { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Minus, X } from "lucide-react";

type ImageCropperModalProps = {
  open: boolean;
  onClose: () => void;
  file: File | null;
  onCropDone: (croppedBlob: Blob) => void;
  aspect?: number;
  /** Short label for where this image is used on the site (e.g. "category icon", "blog cover") */
  usageLabel?: string;
};

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  open,
  onClose,
  file,
  onCropDone,
  aspect = 1,
  usageLabel,
}) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  // When crop area changes
  const onCropComplete = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  // Convert cropped area into Blob
  const getCroppedImageBlob = async (): Promise<Blob | null> => {
    if (!file || !croppedAreaPixels) return null;

    const imageUrl = URL.createObjectURL(file);
    const img = new Image();

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob || null), "image/jpeg");
    });
  };

  const handleCropDone = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const blob = await getCroppedImageBlob();
      if (blob) {
        onCropDone(blob);
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const EPS = 0.001;

  // Required ratio text – must match how the image is displayed on the site
  const getRequiredRatioText = (): string => {
    const a = aspect || 1;
    if (Math.abs(a - 1) < EPS) return "1:1";
    if (Math.abs(a - 4 / 3) < EPS) return "4:3";
    if (Math.abs(a - 3 / 4) < EPS) return "3:4";
    if (Math.abs(a - 16 / 9) < EPS) return "16:9";
    if (Math.abs(a - 9 / 16) < EPS) return "9:16";
    if (Math.abs(a - 1920 / 600) < EPS) return "1920×600";
    if (a >= 1) return `${Math.round(a * 100) / 100}:1`;
    return `1:${Math.round((1 / a) * 100) / 100}`;
  };

  const requiredRatioText = getRequiredRatioText();

  // Output dimensions from current crop (will match required ratio)
  const getOutputDimensions = (): string => {
    if (!croppedAreaPixels) return "— × —";
    const w = Math.round(croppedAreaPixels.width);
    const h = Math.round(croppedAreaPixels.height);
    return `${w} × ${h}`;
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 1));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="admin-dialog-content max-w-4xl bg-white p-0 overflow-hidden flex flex-col [&>button]:hidden" style={{ height: "80vh", maxHeight: "90vh" }}>
        <DialogHeader className="admin-modal-header text-left px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg text-white font-semibold">Adjust the image</DialogTitle>
            <button
              onClick={onClose}
              className="rounded-sm opacity-90 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {file && (
          <div className="relative w-full bg-white flex-1 min-h-1" style={{ position: 'relative', width: '100%', height: '100%', marginTop: 0 }}>
            {/* Zoom Controls - Top Left */}
            <div className="absolute top-4 left-4 z-10 flex flex-row gap-2">
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--theme-primary)" }}
                aria-label="Zoom in"
              >
                <Plus className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--theme-primary)" }}
                aria-label="Zoom out"
              >
                <Minus className="h-5 w-5 text-white" />
              </button>
            </div>

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}>
              <Cropper
                image={URL.createObjectURL(file)}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                aspect={aspect || 1}
              />
            </div>
          </div>
        )}

        {/* Footer – required ratio matches how image is used on site */}
        <div className="admin-modal-footer px-6 py-4 flex items-center justify-between shrink-0">
          <div className="text-sm text-white/90 space-y-0.5">
            <div className="font-medium text-white">
              Required ratio: {requiredRatioText}
              {usageLabel ? ` (used for ${usageLabel} on site)` : " (same as used on site)"}
            </div>
            <div>
              Output dimensions: {getOutputDimensions()}
            </div>
          </div>
          <Button
            onClick={handleCropDone}
            disabled={loading}
            className="bg-white text-[var(--theme-primary)] hover:bg-gray-100 font-medium px-6 border-0"
          >
            {loading ? "Processing..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropperModal;
