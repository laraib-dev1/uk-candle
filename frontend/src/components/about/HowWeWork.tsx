import React from "react";
import { Search, Lightbulb, Settings, Rocket } from "lucide-react";
import { spacing } from "@/utils/spacing";

interface ProcessStep {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface HowWeWorkProps {
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[];
}

const HowWeWork: React.FC<HowWeWorkProps> = ({
  title = "How We Work",
  subtitle = "Our proven process ensures exceptional results for every project",
  steps = [
    {
      icon: Search,
      title: "Research & Planning",
      description: "We start by understanding your needs and conducting thorough research to create a solid foundation for your project.",
    },
    {
      icon: Lightbulb,
      title: "Creative Solutions",
      description: "Our team brainstorms innovative ideas and develops creative solutions tailored to your unique requirements.",
    },
    {
      icon: Settings,
      title: "Development",
      description: "We bring your vision to life with meticulous attention to detail and cutting-edge technology.",
    },
    {
      icon: Rocket,
      title: "Launch & Support",
      description: "We ensure a smooth launch and provide ongoing support to help you achieve long-term success.",
    },
  ],
}) => {
  return (
    <section className={`${spacing.section.gap} bg-gray-50`}>
      <div className="max-w-[1232px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          <div className="w-16 h-1 mx-auto mb-4" style={{ backgroundColor: "var(--theme-primary, #8B5E3C)" }}></div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5" style={{ backgroundColor: "var(--theme-primary, #8B5E3C)" }}></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Connection Node - Hidden on mobile */}
                  <div className="hidden lg:block absolute -top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: "var(--theme-primary, #8B5E3C)" }}></div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 h-full">
                    {/* Icon */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--theme-primary, #8B5E3C)" }}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    
                    {/* Title */}
                    <div className="text-center mb-3">
                      <h3 className="text-base sm:text-lg font-semibold px-3 py-1 inline-block rounded" style={{ backgroundColor: "var(--theme-primary, #8B5E3C)", color: "white" }}>
                        {step.title}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-600 text-center">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
