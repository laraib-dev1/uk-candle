import React from "react";

const services = [
  {
    img: "/product.png",
    text: "Free shipping from $50 and free return on all orders in Canada",
  },
  {
    img: "/product.png",
    text: "Free gift box & gift notes",
  },
  {
    img: "/product.png",
    text: "Fragrance test when you buy",
  },
  {
    img: "/product.png",
    text: "Two free samples with all orders",
  },
  {
    img: "/product.png",
    text: "Free returns",
  },
  {
    img: "/product.png",
    text: "Welcome gift",
  },
];

const AtYourService = () => {
  return (
    <section className="py-12 text-center">
      {/* Decorative border lines */}
      <div className="flex justify-center mb-8">
        <div className="w-250 border-t border-gray-400"></div>
      </div>

      <h2 className="text-xl font-semibold tracking-wide mb-10">
        AT YOUR SERVICE
      </h2>

      <div className="px-6 sm:px-10 md:px-16 lg:px-24">
  <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
    {services.map((service, index) => (
      <div key={index} className="flex flex-col items-center space-y-2">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-300 flex items-center justify-center">
          <img
            src={service.img}
            alt={service.text}
            className="w-10 h-10 object-contain"
          />
        </div>
        <p className="text-[10px] text-gray-600 max-w-[100px] leading-tight text-center">
          {service.text}
        </p>
      </div>
    ))}
  </div>
</div>


      {/* Decorative border line at bottom */}
      <div className="flex justify-center mt-10">
        <div className="w-250 border-t border-gray-400"></div>
      </div>
    </section>
  );
};

export default AtYourService;
