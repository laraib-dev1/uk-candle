import React, { useEffect, useState } from "react";
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
import { getProducts } from "@/api/product.api";

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image?: string;
}


export default function () {
  const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {
  try {
    setLoading(true);
    const data = await getProducts(); // fetch from backend
    setProducts(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
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
          <ProductGrid
  items={products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image || "/product.png",
    offer: p.discount ? `${p.discount}% OFF` : undefined
  }))}
/>

        </section>
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
           <CategorySection />
        </section>
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
           <FeatureHero/>
        </section>


        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
<ProductGrid
  items={products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image || "/product.png",
    offer: p.discount ? `${p.discount}% OFF` : undefined
  }))}
/>
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
