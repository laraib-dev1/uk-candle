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
    <section className="py-10 px-4 text-center">
      {/* Decorative border lines */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-full border-t border-gray-400"></div>
      </div>

      <h2 className="text-xl font-semibold tracking-wide mb-10">
        AT YOUR SERVICE
      </h2>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-300 flex items-center justify-center">
              <img
                src={service.img}
                alt={service.text}
                className="w-16 h-16 object-cover"
              />
            </div>
            <p className="text-[10px] text-gray-600 max-w-[100px] leading-tight text-center">
              {service.text}
            </p>
          </div>
        ))}
      </div>

      {/* Decorative border line at bottom */}
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-full border-t border-gray-400"></div>
      </div>
    </section>
  );
};

export default AtYourService;
