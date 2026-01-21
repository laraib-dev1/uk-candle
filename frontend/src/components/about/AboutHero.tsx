import React from "react";

interface AboutHeroProps {
  title?: string;
  description?: string;
  stats?: Array<{ value: string; label: string }>;
  image?: string;
  meetTeamLink?: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({
  title = "Building Excellence Through Innovation and Integrity",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  stats = [
    { value: "15+", label: "YEARS OF EXCELLENCE" },
    { value: "500+", label: "SATISFIED CLIENTS" },
    { value: "1200+", label: "PROJECTS COMPLETED" },
  ],
  image = "/about-hero.jpg",
  meetTeamLink = "#team",
}) => {
  return (
    <section className="py-3 sm:py-5 md:py-8 lg:py-10">
      <div className="max-w-[1232px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
            
            <div className="space-y-4 text-gray-700 text-sm sm:text-base">
              <p>{description}</p>
              <p>{description}</p>
              <p>{description}</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1" style={{ color: "var(--theme-primary, #8B5E3C)" }}>
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Meet Our Team Link */}
            <a
              href={meetTeamLink}
              className="inline-block text-sm font-medium hover:underline transition-colors"
              style={{ color: "var(--theme-primary, #8B5E3C)" }}
            >
              Meet Our Team →
            </a>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={image}
                alt="About Us"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/hero.png";
                }}
              />
              {/* Award Badge Overlay */}
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 sm:p-4 border-2" style={{ borderColor: "var(--theme-primary, #8B5E3C)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--theme-primary, #8B5E3C)" }}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold" style={{ color: "var(--theme-primary, #8B5E3C)" }}>
                    Award Winning
                  </span>
                </div>
                <p className="text-xs text-gray-600">Excellence Service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
