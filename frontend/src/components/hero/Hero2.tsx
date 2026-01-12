import React from "react";
import Button from "../ui/buttons/Button";
import { useNavigate } from "react-router-dom";

type Props = {
  title?: string;
  subtitle?: string;
  image?: string;
  imagePosition?: "left" | "right";
  fullWidthText?: boolean; // new prop
};

const Hero2 = ({
  title,
  subtitle,
  image,
  imagePosition = "right",
  fullWidthText = false,
}: Props) => {
  const navigate = useNavigate(); // <-- useNavigate hook
  const heroImage = image || "/hero.png";

  const handleShopMore = () => {
    navigate("/shop"); // navigate to shop page
  };

  return (
    <section className="py-0 bg-gray-200">
      {fullWidthText ? (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center py-10 text-center">
            <h1 className="text-2xl md:text-4xl font-serif leading-tight tracking-tight">
              {title || "Welcome to Our Store"}
            </h1>
            <p className="mt-2.5 text-gray-600 text-sm md:text-base max-w-3xl mx-auto">
              {subtitle || "Explore our latest collections and exclusive deals."}
            </p>
            <div className="mt-2.5 flex justify-center">
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
              >Shop More</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
          {imagePosition === "left" && image && (
            <div className="w-full h-80 md:h-[500px] overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
              ></div>
            </div>
          )}

          <div className={`${imagePosition === "left" ? "order-2 md:order-1" : "order-1"} max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center`}>
            <h1 className="text-2xl md:text-4xl font-serif leading-tight tracking-tight">
              {title || "Welcome to Our Store"}
            </h1>
            <p className="mt-2.5 text-gray-600 text-sm md:text-base max-w-lg">
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
              >Shop More</Button>
            </div>
          </div>

          {imagePosition === "right" && image && (
            <div className={`w-full h-80 md:h-[500px] overflow-hidden ${imagePosition === "left" ? "order-1 md:order-2" : "order-2"}`}>
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Hero2;
