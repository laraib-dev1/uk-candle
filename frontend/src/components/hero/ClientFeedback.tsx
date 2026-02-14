import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { spacing } from "@/utils/spacing";
import { getLandingReviews } from "@/api/review.api";

type FeedbackItem = { title: string; name: string; role: string; text: string; img: string };

/**
 * ClientFeedback.tsx
 *
 * Fetches reviews marked "Show on Landing" by admin and displays them in a carousel.
 * Admin manages which reviews appear via Admin → Reviews (toggle "Show on Landing").
 */

const ClientFeedback: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const reviews = await getLandingReviews();
        const mapped: FeedbackItem[] = (reviews || []).map((r: any) => {
          const userName = typeof r.userId === "object" && r.userId?.name ? r.userId.name : "Customer";
          const avatar = typeof r.userId === "object" && r.userId?.avatar ? r.userId.avatar : "";
          const img = avatar && avatar.startsWith("http") ? avatar : "/client.jpeg";
          const title = r.productName ? `${r.productName} (${r.rating}/5)` : `${r.rating} stars`;
          return {
            title,
            name: userName,
            role: "Client",
            text: r.comment || "",
            img,
          };
        });
        setFeedbacks(mapped);
      } catch {
        setFeedbacks([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!feedbacks.length) return;
    const carousel = carouselRef.current;
    if (!carousel) return;

    const updateActiveIndex = () => {
      const cards = carousel.querySelectorAll<HTMLDivElement>("[data-card]");
      if (cards.length === 0) return;
      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter = carouselRect.left + carouselRect.width / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - carouselCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    };

    updateActiveIndex();
    carousel.addEventListener("scroll", updateActiveIndex);
    window.addEventListener("resize", updateActiveIndex);
    return () => {
      carousel.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [feedbacks.length]);

  const scroll = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector<HTMLDivElement>("[data-card]");
    if (!card) return;
    const cardWidth = card.clientWidth;
    const gap = 32;
    carousel.scrollBy?.({ left: direction === "left" ? -cardWidth - gap : cardWidth + gap, behavior: "smooth" });
  };

  if (!feedbacks.length) return null;

  return (
    <section className="relative overflow-hidden py-0 bg-gradient-to-r from-[#f9ede6] to-[#fef9f7]">
      <div className="pointer-events-none absolute top-8 right-6 w-40 h-40 rounded-full bg-[#f4cdbf] opacity-30 blur-[1px]" />
      <div className="pointer-events-none absolute left-6 bottom-6 w-36 h-36 rounded-full bg-[#f4cdbf] opacity-20 blur-[1px]" />

      <div className={`max-w-8xl mx-auto ${spacing.container.paddingSectionAlign}`}>
        <h2 className={`text-center text-3xl italic text-gray-700 font-serif ${spacing.inner.gapTop} ${spacing.inner.gapBottom}`}>
          Client Feedback
        </h2>

        <div className={`flex items-center justify-center gap-2 ${spacing.inner.gapBottom}`}>
          {feedbacks.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "w-8" : ""}`}
              style={{ backgroundColor: "var(--theme-primary, #8B5E3C)", opacity: index === activeIndex ? "1" : "0.3" }}
            />
          ))}
        </div>

        <div className="relative">
          <button
            aria-label="Scroll left"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 py-4 no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {feedbacks.map((item, i) => (
              <article
                data-card
                key={i}
                className="bg-white rounded-md shadow-md min-w-[320px] sm:min-w-[360px] md:min-w-[380px] flex-shrink-0 snap-center p-6 flex flex-col"
                role="group"
              >
                <div className="mb-4">
                  <span className="text-3xl font-serif mr-2" style={{ color: "var(--theme-primary)" }}>"</span>
                  <h3 className="text-lg font-semibold text-gray-800 inline-block align-middle">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.text}</p>
                <div className="mt-auto bg-gray-50 border-t border-gray-100 pt-3 -mx-6 px-6 pb-3 flex items-center gap-3">
                  <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name} <span className="font-normal" style={{ color: "var(--theme-primary)" }}>/</span>{" "}
                      <span className="text-xs font-medium" style={{ color: "var(--theme-primary)" }}> {item.role}</span>
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            aria-label="Scroll right"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClientFeedback;
