import React from "react";
import Button from "../ui/buttons/Button";
import { useNavigate } from "react-router-dom";
import { spacing } from "@/utils/spacing";


type Props = {
  title?: string;
  subtitle?: string;
  image?: string;
  imagePosition?: "left" | "right"; 
  variant?: "side-image" | "full-background"; 
};

const Hero = ({
  title,
  subtitle,
  image,
  imagePosition = "right",
  variant = "side-image",
}: Props) => {
  const heroImage = image || "/hero.png";
  const navigate = useNavigate();
const handleShopMore = () => {
    navigate("/shop"); // <-- navigate to your shop page
  };
  // FULL BACKGROUND VERSION – content aligned to the right. Aspect 1920×600 to match admin banner spec.
  if (variant === "full-background") {
    return (
      <section
        className="relative bg-cover bg-center bg-no-repeat w-full"
        style={{
          backgroundImage: `url(${heroImage})`,
          aspectRatio: "1920 / 600",
          minHeight: "150px",
        }}
      >
        <div className="bg-black/40 w-full h-full absolute inset-0" aria-hidden="true" />

        <div className={`relative max-w-8xl mx-auto ${spacing.container.paddingSectionAlign} h-full flex flex-col justify-center items-start text-left`}>
          <div className="text-white max-w-xl">
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif leading-tight">
              {title || "Welcome to Our Store"}
            </h1>
            <p className="mt-1 sm:mt-1.5 md:mt-2.5 text-xs sm:text-sm md:text-base text-gray-200">
              {subtitle || "Explore our latest collections and exclusive deals."}
            </p>

            <div className="mt-2.5 flex justify-start">
              <Button
                onClick={handleShopMore}
                style={{
                  backgroundColor: "var(--theme-primary)",
                  borderColor: "var(--theme-primary)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--theme-primary)";
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--theme-primary)";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Shop Candles
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // LEFT / RIGHT IMAGE VERSION
  return (
    <section className="relative bg-gray-50">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 items-center">

        {/* Text - inner section padding before heading and after button */}
        <div className={`${imagePosition === "left" ? "order-2 md:order-1" : "order-1"} w-full max-w-8xl mx-auto ${spacing.container.paddingSectionAlign} ${spacing.inner.gapTop} ${spacing.inner.gapBottom}`}>
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif leading-tight tracking-tight">
            {title || "Welcome to Our Store"}
          </h1>

          <p className="mt-1 sm:mt-1.5 md:mt-2 text-xs sm:text-sm md:text-base text-gray-600 max-w-xl">
            {subtitle || "Explore our latest collections and exclusive deals."}
          </p>

          <div className="mt-2.5">
            <Button 
              onClick={handleShopMore}
              style={{ 
                backgroundColor: "var(--theme-primary)",
                borderColor: "var(--theme-primary)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--theme-primary)";
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--theme-primary)";
                e.currentTarget.style.opacity = "1";
              }}
            >Learn More</Button>
          </div>
        </div>

        {/* Side Image */}
        <div
          className={`w-full h-[120px] sm:h-[160px] md:h-[250px] lg:h-[350px] xl:h-[450px] bg-cover bg-center ${
            imagePosition === "left" ? "order-1 md:order-2" : "order-2"
          }`}
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
      </div>
    </section>
  );
};

export default Hero;
