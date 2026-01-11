import React from "react";

interface FeatureHeroProps {
  image?: string;
}

const FeatureHero: React.FC<FeatureHeroProps> = ({ image }) => {
  const bannerImage = image || "/hero.png";
  
  return (
    <section className="bg-white text-black py-0">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Text content */}
        <div className="max-w-3xl mx-auto mb-2.5">
          <h2 className="text-2xl md:text-4xl font-semibold mb-2.5 text-gray-900">
            An alchemy of gold and perfume
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            The Maison's iconic fragrance, adorned in gold to celebrate the
            brilliance of the holidays.
          </p>
        </div>

        {/* Image */}
        <div className="w-full">
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
