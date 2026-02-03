import React from "react";

const features = [
  {
    img: "/feature 01.png",
    title: "100% Natural",
    subtitle: "Made with plant-based oils and soy wax",
  },
  {
    img: "/feature 02.png",
    title: "Skin Safe",
    subtitle: "Gentle ingredients suitable for all skin types",
  },
  {
    img: "/feature 03.png",
    title: "Eco Conscious",
    subtitle: "Sustainable materials and recyclable packaging",
  },
    {
    img: "/feature 03.png",
    title: "Free Delivery",
    subtitle: "Free UK delivery on orders over £50",
  },
  {
    img: "/feature 04.png",
    title: "Easy Returns",
    subtitle: "Return Up To 14 Days",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-0 bg-white text-black text-center">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12 justify-items-center">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex flex-col items-center space-y-3 w-full min-w-0 max-w-[200px]"
          >
            <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-gray-300 flex items-center justify-center">
              <img
                src={feature.img}
                alt={feature.title}
                className="w-24 h-24 object-cover"
              />
            </div>
            <h3 className="text-base font-semibold break-words w-full">{feature.title}</h3>
            <p className="text-sm text-gray-500 break-words w-full min-w-0">{feature.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
