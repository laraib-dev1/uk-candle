import React from "react";

interface Category {
  title: string;
  image?: string;
}

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  return (
    <section className="py-6 bg-white text-black">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold mb-6 tracking-wide">
          ALL GIFT IDEAS
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4 justify-center mx-auto">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="shrink-0 w-48 text-center group"
            >
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
