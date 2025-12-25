import React from "react";
import { useNavigate } from "react-router-dom";

// Simple banner-like hero used on the Landing page.
// We add an optional `image` prop so you can control the image
// from the admin Assets → Banners tab.
type FeatureHeroProps = {
  image?: string;
  targetUrl?: string;
};

const FeatureHero: React.FC<FeatureHeroProps> = ({ image, targetUrl }) => {
  const bannerImage = image || "/hero.png";
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
    <section className="bg-white text-black py-4">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Text content */}
        <div className="max-w-3xl mx-auto mb-6">
          <h2 className="text-2xl md:text-4xl font-semibold mb-3 text-gray-900">
            An alchemy of gold and perfume
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            The Maison's iconic fragrance, adorned in gold to celebrate the
            brilliance of the holidays.
          </p>
        </div>

        {/* Image */}
        <div 
          className={`w-full ${targetUrl ? "cursor-pointer" : ""}`}
          onClick={targetUrl ? handleBannerClick : undefined}
        >
          <img
            src={bannerImage}
            alt="Perfume collection"
            className="w-full max-w-full h-100 object-cover rounded-2xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureHero;
