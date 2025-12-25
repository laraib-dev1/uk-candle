import React, { useState } from "react";
import Button from "../ui/buttons/Button";
import { useNavigate } from "react-router-dom";

type Props = {
  title?: string;
  subtitle?: string;
  image?: string;
  imagePosition?: "left" | "right";
  fullWidthText?: boolean; // new prop
  targetUrl?: string;
};

const Hero2 = ({
  title,
  subtitle,
  image,
  imagePosition = "right",
  fullWidthText = false,
  targetUrl,
}: Props) => {
  const navigate = useNavigate(); // <-- useNavigate hook
  const heroImage = image || "/hero.png";
  const [loading, setLoading] = useState(false);

  const handleShopMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      navigate("/shop");
    } finally {
      setLoading(false);
    }
  };

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
    <section className="py-10 bg-gray-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {fullWidthText ? (
          <div className="flex flex-col justify-center py-10 text-center">
            <h1 className="text-2xl md:text-4xl font-serif leading-tight tracking-tight">
              {title || "Welcome to Our Store"}
            </h1>
            <p className="mt-3 text-gray-600 text-sm md:text-base max-w-3xl mx-auto">
              {subtitle || "Explore our latest collections and exclusive deals."}
            </p>
            <div className="mt-6 flex justify-center">
              <Button onClick={handleShopMore} loading={loading}>Shop More</Button>
            </div>
          </div>
        ) : (
          <div
            // className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center ${
            //   imagePosition === "left" ? "md:flex-row-reverse" : ""
            // }`}
            className={`grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-6 items-center`}
          >
            {imagePosition === "left" && image && (
              <div 
                className={`w-full h-72 md:h-[380px] overflow-hidden rounded-l-2xl md:rounded-l-2xl md:rounded-r-none ${targetUrl ? "cursor-pointer" : ""}`}
                onClick={targetUrl ? handleBannerClick : undefined}
              >
                <img
                  src={heroImage}
                  alt="hero"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            <div className="flex flex-col justify-center px-2 md:px-0">
              <h1 className="text-2xl md:text-4xl font-serif leading-tight tracking-tight">
                {title || "Welcome to Our Store"}
              </h1>
              <p className="mt-3 text-gray-600 text-sm md:text-base max-w-lg">
                {subtitle || "Explore our latest collections and exclusive deals."}
              </p>
              <div className="mt-6">
                <Button onClick={handleShopMore} loading={loading}>Shop More</Button>
              </div>
            </div>

            {imagePosition === "right" && image && (
              <div 
                className={`w-full h-72 md:h-[380px] overflow-hidden rounded-r-2xl md:rounded-r-2xl md:rounded-l-none ${targetUrl ? "cursor-pointer" : ""}`}
                onClick={targetUrl ? handleBannerClick : undefined}
              >
                <img
                  src={heroImage}
                  alt="hero"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero2;
