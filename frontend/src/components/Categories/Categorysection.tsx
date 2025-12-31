import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  title: string;
  image?: string;
}

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleCategoryClick = (category: Category) => {
    // Navigate to shop page with category as query param
    navigate(`/shop?category=${encodeURIComponent(category.title)}`);
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Calculate scroll amount (width of one category card + gap)
    const cardWidth = 192; // w-48 = 192px
    const gap = 16; // gap-4 = 16px
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-6 bg-white text-black">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold mb-6 tracking-wide">
          ALL GIFT IDEAS
        </h2>

        <div className="relative">
          {/* Left Arrow */}
          {categories.length > 0 && (
            <button
              aria-label="Scroll left"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* Scrollable Categories Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth px-12"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
          >
            <style>{`
              div::-webkit-scrollbar {
                display: none; /* Chrome, Safari, Opera */
              }
            `}</style>
            {categories.map((cat, index) => (
              <div
                key={index}
                className="shrink-0 w-48 text-center group cursor-pointer"
                onClick={() => handleCategoryClick(cat)}
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

          {/* Right Arrow */}
          {categories.length > 0 && (
            <button
              aria-label="Scroll right"
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
