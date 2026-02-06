import React from "react";
import { spacing } from "@/utils/spacing";

interface FeatureHeroProps {
  image?: string;
}

const FeatureHero: React.FC<FeatureHeroProps> = ({ image }) => {
  const bannerImage = image || "/hero.png";
  
  return (
    <section className={`bg-white text-black ${spacing.section.gap}`}>
      <div className={`max-w-8xl mx-auto ${spacing.container.paddingSectionAlign} text-center`}>
        {/* Text content */}
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-900 ${spacing.inner.gapBottom}`}>
            An Signature Blen of Craft and Scent
          </h2>
          <p className={`text-xs sm:text-sm md:text-base text-gray-600 ${spacing.inner.gapBottom}`}>
            Discover luxury handcrafted candles infused with premium fragrance oils and natural wax blends. Each piece is thoughtfully designed to elevate your home, events, and gifting moments.
          </p>
        </div>

        {/* Image – same aspect as admin hero-tertiary (1920×600) */}
        <div className="w-full max-w-full mx-auto overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl">
          <img
            src={bannerImage}
            alt="Perfume collection"
            className="w-full max-w-full object-cover"
            style={{ aspectRatio: "1920 / 600", minHeight: "120px" }}
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureHero;
