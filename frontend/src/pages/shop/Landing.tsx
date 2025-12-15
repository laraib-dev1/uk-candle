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
import { getBanners, type Banner } from "@/api/banner.api";
import { getCategories } from "@/api/category.api";
interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  category?: {
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
  icon?: string; // optional if you have
}

export default function () {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroBanner, setHeroBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBanners();
  }, []);

  // Load products for the landing page carousels / grids
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

  // Load categories for the category section
  const fetchCategories = async () => {
    try {
      const data = await getCategories(); // <-- API call
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Load banners and pick the "hero-main" one for this page
  const fetchBanners = async () => {
    try {
      const data = await getBanners();
      const hero = data.find((b) => b.slot === "hero-main");
      setHeroBanner(hero || null);
    } catch (err) {
      console.error("Failed to load banners for Landing page", err);
    }
  };
  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">

      <Navbar />
      <main>
        {/* Top hero section. If admin has configured a hero banner, we show it.
            Otherwise we fall back to the previous static image. */}
        {heroBanner ? (
          <Hero
            title="Welcome to our store"
            subtitle="Discover our latest collections."
            image={heroBanner.imageUrl}
            variant="full-background"
          />
        ) : (
          <Hero
            title="Welcome to our store"
            subtitle="This hero uses the image as full background"
            image="hero.png"
            variant="full-background"
          />
        )}

        {/* </section> */}
        
       
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* <h2 className="text-center text-gray-500 uppercase tracking-wide text-sm">Featured</h2> */}
<ProductGrid
  items={products
    .slice(0, 5)
    .map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      image: [p.image1, p.image2, p.image3, p.image4, p.image5, p.image6].find(
        (img) => img && img.trim() !== ""
      ) || "/product.png",
      offer: p.discount ? `${p.discount}% OFF` : undefined,
    }))
  }
/>


        </section>
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
           <CategorySection
  categories={categories.map(cat => ({
    title: cat.name,
    image: cat.icon || "/category.png"
  }))}
/>

        </section>
        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
           <FeatureHero/>
        </section>


        <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
<ProductGrid
  items={products
    .slice(0, 5) // <-- only take the first 5 products
    .map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      image: [
        p.image1,
        p.image2,
        p.image3,
        p.image4,
        p.image5,
        p.image6
      ].filter(Boolean)[0] || "/product.png",
      offer: p.discount ? `${p.discount}% OFF` : undefined
    }))
  }
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
