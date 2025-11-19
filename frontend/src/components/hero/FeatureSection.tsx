import React from "react";

const features = [
  {
    img: "/assets/organic.png",
    title: "100% Organic",
    subtitle: "Natural ingredients",
  },
  {
    img: "/assets/safe.png",
    title: "Safe For The Body",
    subtitle: "All Skin Types",
  },
  {
    img: "/assets/delivery.png",
    title: "Free Delivery",
    subtitle: "Orders Over $100",
  },
  {
    img: "/assets/returns.png",
    title: "Easy Returns",
    subtitle: "Return Up To 14 Days",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900 text-black dark:text-white text-center">
      <div className="flex flex-wrap justify-center gap-10 px-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex flex-col items-center space-y-2 max-w-[160px]"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              <img
                src={feature.img}
                alt={feature.title}
                className="w-12 h-12 object-contain"
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
