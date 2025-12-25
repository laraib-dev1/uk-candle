// components/shop/Banner.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface BannerProps {
  imageSrc: string;
  alt?: string;
  height?: string;
  targetUrl?: string;
}

const Banner: React.FC<BannerProps> = ({
  imageSrc,
  alt = "Shop Banner",
  height = "h-64",
  targetUrl,
}) => {
  const navigate = useNavigate();

  const handleBannerClick = () => {
    if (targetUrl && targetUrl.trim() !== "") {
      // Check if it's an external URL or internal route
      if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
        window.open(targetUrl, "_blank");
      } else {
        navigate(targetUrl);
      }
    }
  };

  return (
    <section 
      className={`w-full ${height} overflow-hidden rounded-lg ${targetUrl ? "cursor-pointer" : ""}`}
      onClick={targetUrl ? handleBannerClick : undefined}
    >
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </section>
  );
};

export default Banner;
