import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  title: string;
  image?: string;
}

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 bg-white text-black">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold mb-6 tracking-wide">
          ALL GIFT IDEAS
        </h2>

        {/* Handlers above categories - side by side */}
        <div className="flex justify-end gap-2 mb-4 px-2">
          <button
            onClick={scrollLeft}
            className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Scroll left"
            style={{ cursor: "pointer" }}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={scrollRight}
            className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Scroll right"
            style={{ cursor: "pointer" }}
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Categories Container - Centered and contained within margins */}
        <div className="w-full overflow-hidden px-2 justify-center">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide justify-start"
            style={{ 
              scrollbarWidth: "none", 
              msOverflowStyle: "none"
            }}
          >
          {categories.map((cat, index) => (
            <div
              key={index}
              className="shrink-0 w-24 md:w-48 text-center group"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                const categoryName = cat.title;
                window.location.href = `/shop?category=${encodeURIComponent(categoryName)}`;
              }}
            >
              <div className="overflow-hidden rounded-2xl shadow-md bg-gray-200 aspect-square">
                <img
                  src={(cat.image && cat.image.trim() !== "") ? cat.image : "/category.png"}
                  alt={cat.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== window.location.origin + "/category.png") {
                      target.src = "/category.png";
                    }
                  }}
                />
              </div>
              <p className="mt-3 text-sm md:text-lg text-gray-800 font-medium italic">
                {cat.title}
              </p>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
