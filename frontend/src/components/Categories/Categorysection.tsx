import React from "react";

const categories = [
  {
    title: "Fragrances",
    image: "/category.png",
  },
  {
    title: "Candles & Home",
    image: "/category.png",
  },
  {
    title: "Bath & Body",
    image: "/product.png",
  },
  {
    title: "Home Decor",
    image: "/category.png",
  },
];

const CategorySection = () => {
  return (
    <section className="py-0 bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold mb-10 tracking-wide">
          ALL GIFT IDEAS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="overflow-hidden rounded-2xl shadow-md bg-gray-200 aspect-square">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                />
              </div>

              <p className="mt-3 text-lg text-gray-800 font-medium italic">
                {cat.title} 
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
