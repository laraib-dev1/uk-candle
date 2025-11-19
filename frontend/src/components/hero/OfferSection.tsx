import React from "react";

const OfferSection = () => {
  return (
    <section className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Offer Image */}
          <div className="w-full h-72 md:h-[400px] overflow-hidden rounded-l-2xl md:rounded-l-2xl md:rounded-r-none">
            <img
              src="/offers.png"
              alt="Offer 1"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right Offer Image */}
          <div className="w-full h-72 md:h-[400px] overflow-hidden rounded-r-2xl md:rounded-l-none">
            <img
              src="/offers.png"
              alt="Offer 2"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
