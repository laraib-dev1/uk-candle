import React, { useState } from "react";

type Props = {
  images: string[];
};

export default function ProductImageGallery({ images }: Props) {
  const [selected, setSelected] = useState(images[0] || "/product.png");

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image - 3:4 aspect ratio - Smaller size, aligned left */}
      <div className="w-full max-w-sm aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg border border-gray-200 flex items-center justify-center">
        <img
          src={selected}
          alt="Product"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/product.png";
          }}
        />
      </div>

      {/* Thumbnails - 4 small square boxes below main image - Shorter but keep 3:4 ratio */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
        {images.slice(0, 4).map((img, i) => (
          <div
            key={i}
            onClick={() => setSelected(img)}
            className={`w-full aspect-square bg-gray-100 overflow-hidden rounded-lg border-2 cursor-pointer transition-all
              ${selected === img ? "" : "border-gray-200"}`}
            style={selected === img ? { borderColor: "var(--theme-primary)" } : {}}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/product.png";
              }}
            />
          </div>
        ))}
        {/* Fill remaining slots if less than 4 images */}
        {images.length < 4 && Array.from({ length: 4 - images.length }).map((_, i) => (
          <div
            key={`placeholder-${i}`}
            className="w-full aspect-square bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center"
          >
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        ))}
      </div>
    </div>
  );
}
