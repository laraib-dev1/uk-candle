import React from "react";
import { spacing } from "@/utils/spacing";

const services = [
  {
    img: "/icon 01.png",
    text: "Free UK shipping on orders over £50",
  },
  {
    img: "/icon 02.png",
    text: "Luxury gift packaging with personalized notes",
  },
  {
    img: "/icon 03.png",
    text: "Scent discovery samples with every order",
  },
  {
    img: "/icon 04.png",
    text: "Two complimentary samples with purchases",
  },
  {
    img: "/icon 05.png",
    text: "Easy returns within 14 days",
  },
  {
    img: "/icon 06.png",
    text: "Welcome discount for new customers",
  },
];

const AtYourService = () => {
  return (
    <section className="py-0 text-center">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative border lines */}
        <div className="flex justify-center">
          <div className="w-full border-t border-gray-400"></div>
        </div>

        <h2 className="text-xl font-semibold tracking-wide">
          AT YOUR SERVICE
        </h2>

        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-6 justify-items-center ${spacing.inner.gapTop}`}>
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border border-gray-300 flex items-center justify-center flex-shrink-0">
                <img
                  src={service.img}
                  alt={service.text}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 max-w-[100px] leading-tight text-center">
                {service.text}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative border line at bottom */}
        <div className="flex justify-center">
          <div className="w-full border-t border-gray-400"></div>
        </div>
      </div>
    </section>
  );
};

export default AtYourService;
