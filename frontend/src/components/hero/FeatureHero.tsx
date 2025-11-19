import React from "react";

const FeatureHero = () => {
  return (
    <section className="bg-white dark:bg-gray-900 text-black dark:text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Text content */}
        <div className="max-w-3xl mx-auto mb-6">
          <h2 className="text-2xl md:text-4xl font-semibold mb-3 text-gray-900">
            An alchemy of gold and perfume
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            The Maison’s iconic fragrance, adorned in gold to celebrate the
            brilliance of the holidays.
          </p>
        </div>

        {/* Image */}
        <div className="w-full">
          <img
            src="/hero.png"
            alt="Perfume collection"
            className="w-full h-150 object-cover rounded-2xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureHero;
