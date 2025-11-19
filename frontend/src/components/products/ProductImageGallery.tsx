import React, { useState } from "react";

type Props = {
  images: string[];
};

export default function ProductImageGallery({ images }: Props) {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <img
        src={selected}
        alt="Product"
        className="w-full h-[400px] object-cover rounded"
      />

      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.slice(0, 4).map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Thumbnail ${i}`}
            onClick={() => setSelected(img)}
            className={`w-16 h-16 object-cover rounded border cursor-pointer 
              ${selected === img ? "border-amber-500" : "border-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
