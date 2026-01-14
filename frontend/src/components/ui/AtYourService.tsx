import React from "react";

const services = [
  {
    img: "/icon 01.png",
    text: "Free shipping from $50 and free return on all orders in Canada",
  },
  {
    img: "/icon 02.png",
    text: "Free gift box & gift notes",
  },
  {
    img: "/icon 03.png",
    text: "Fragrance test when you buy",
  },
  {
    img: "/icon 04.png",
    text: "Two free samples with all orders",
  },
  {
    img: "/icon 05.png",
    text: "Free returns",
  },
  {
    img: "/icon 06.png",
    text: "Welcome gift",
  },
];

const AtYourService = () => {
  return (
    <section className="py-0 text-center">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative border lines */}
        <div className="flex justify-center mb-1 sm:mb-2 md:mb-4">
          <div className="w-full border-t border-gray-400"></div>
        </div>

        <h2 className="text-xl font-semibold tracking-wide mb-0.5 sm:mb-1 md:mb-2.5">
          AT YOUR SERVICE
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 sm:gap-1.5 md:gap-3 justify-items-center">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-gray-300 flex items-center justify-center">
                <img
                  src={service.img}
                  alt={service.text}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover"
                />
              </div>
              <p className="text-[9px] sm:text-[10px] text-gray-600 max-w-[90px] sm:max-w-[100px] leading-tight text-center">
                {service.text}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative border line at bottom */}
        <div className="flex justify-center mt-2.5 sm:mt-5">
          <div className="w-full border-t border-gray-400"></div>
        </div>
      </div>
    </section>
  );
};

export default AtYourService;
