import React, { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ImageCropperModalProps = {
  open: boolean;
  onClose: () => void;
  file: File | null;
  onCropDone: (croppedBlob: Blob) => void;
  aspect?: number;
};

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  open,
  onClose,
  file,
  onCropDone,
  aspect = 1,
}) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

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
    const blob = await getCroppedImageBlob();
    if (blob) {
      onCropDone(blob);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        {file && (
  <div
    className="relative w-full"
    style={{
    
      height: `${300 / aspect}px`, 
      maxHeight: "70vh",         
    }}
  >
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
)}


        <div className="flex justify-end  gap-2 mt-4">
          <Button className="text-black" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="text-black"  onClick={handleCropDone}>Crop</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropperModal;
