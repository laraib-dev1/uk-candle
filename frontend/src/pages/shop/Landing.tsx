import React from "react";
import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/hero/Hero";
import ProductGrid from "../../components/products/ProductGrid";
import Footer from "../../components/layout/Footer";
import CategorySection from "../../components/Categories/Categorysection";
import FeatureHero from "@/components/hero/FeatureHero";
import OfferSection from "@/components/hero/OfferSection";
import AtYourService from "@/components/ui/AtYourService";
import Hero2 from "@/components/hero/Hero2";
import FeatureSection from "@/components/hero/FeatureSection";
import ClientFeedback from "@/components/hero/ClientFeedback";
const sample = [
  { id: 1, title: "Eucalyptus Essential Oil", price: 4.99, image: "/product.png" },
  { id: 2, title: "Rapeseed Candle", price: 22.5, image: "/product.png" },
  { id: 3, title: "Rapeseed Wax Candle", price: 42.0, image: "product.png" },
  { id: 4, title: "Fresh Brew Limited Edition", price: 24.0, image: "product.png" },
  { id: 5, title: "Fresh Brew Limited Edition", price: 24.0, image: "product.png" },
];
const allProducts = [
    { id: 1, title: "Eucalyptus Essential Oil", price: 4.99, image: "/product.png" },
    { id: 2, title: "Rapeseed Candle", price: 22.5, image: "/product.png" },
    { id: 3, title: "Rapeseed Wax Candle", price: 42.0, image: "product.png",  offer: "15% OFF" },
    { id: 4, title: "Fresh Brew Limited Edition", price: 24.0, image: "product.png" },
    { id: 5, title: "Lavender Soap", price: 5.99, image: "/product.png" },
    { id: 6, title: "Rose Candle", price: 15.5, image: "/product.png", offer: "10% OFF" },
    { id: 7, title: "Mint Balm", price: 12.0, image: "/product.png" },
    // ...more products from admin
  ];

export default function () {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white text-gray-800 overflow-x-hidden">

      <Navbar />
      <main>
        {/* <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-30"> */}
          <Hero
  title="Welcome to our store"
  subtitle="This hero uses the image as full background"
  image="hero.png"
  variant="full-background"
/>

        {/* </section> */}
        
       
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* <h2 className="text-center text-gray-500 uppercase tracking-wide text-sm">Featured</h2> */}
          <ProductGrid items={sample} />
        </section>
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
           <CategorySection />
        </section>
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
           <FeatureHero/>
        </section>


        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ProductGrid items={allProducts} /> {/* no limit → unlimited rows */}
        </section>
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <OfferSection />
        </section>
         <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
           <Hero2
           title="Discover new scents"
           subtitle="A selection of fragrances to brighten your mood."
           image="/hero.png"
           imagePosition="right"
           />
         </section>
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AtYourService />
        </section>
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Hero
          title="Discover your natural glow"
          subtitle="Pure essentials for body and mind."
          image="/hero.png"
          imagePosition="left"
          />
        </section>
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <FeatureSection />
        </section>
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ClientFeedback />
        </section>

      </main>
      <Footer />
    </div>
  );
}
