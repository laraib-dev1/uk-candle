// components/shop/Banner.tsx
import React from "react";

interface BannerProps {
  imageSrc: string;
  alt?: string;
  height?: string;
}

const Banner: React.FC<BannerProps> = ({
  imageSrc,
  alt = "Shop Banner",
  height = "h-64",
}) => {
  return (
    <section className={`w-full ${height} overflow-hidden rounded-lg`}>
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </section>
  );
};

export default Banner;
