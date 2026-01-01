import React from "react";

const features = [
  {
    img: "/feature 01.png",
    title: "100% Organic",
    subtitle: "Natural ingredients",
  },
  {
    img: "/feature 02.png",
    title: "Safe For The Body",
    subtitle: "All Skin Types",
  },
  {
    img: "/feature 03.png",
    title: "Free Delivery",
    subtitle: "Orders Over $100",
  },
  {
    img: "/feature 04.png",
    title: "Easy Returns",
    subtitle: "Return Up To 14 Days",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-12 bg-white text-black text-center">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-10">
    {features.map((feature, i) => (
      <div
        key={i}
        className="flex flex-col items-center space-y-2 max-w-160px"
      >
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-300 flex items-center justify-center">
          <img
            src={feature.img}
            alt={feature.title}
            className="w-16 h-16 object-cover"
          />
        </div>
        <h3 className="text-sm font-semibold">{feature.title}</h3>
        <p className="text-xs text-gray-500">{feature.subtitle}</p>
      </div>
    ))}
  </div>
</section>

  );
};

export default FeatureSection;
