import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import HowWeWork from "@/components/about/HowWeWork";
import TeamSection from "@/components/about/TeamSection";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-14 sm:pt-16">
        {/* Hero/Introduction Section */}
        <AboutHero />

        {/* How We Work Section */}
        <HowWeWork />

        {/* Team Section */}
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}
