import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/hero/Hero";
import ProductGrid from "../../components/products/ProductGrid";
import { ProductGridSkeleton } from "../../components/products/ProductGridSkeleton";
import Footer from "../../components/layout/Footer";
import CategorySection from "../../components/Categories/Categorysection";
import FeatureHero from "@/components/hero/FeatureHero";
import OfferSection from "@/components/hero/OfferSection";
import AtYourService from "@/components/ui/AtYourService";
import Hero2 from "@/components/hero/Hero2";
import FeatureSection from "@/components/hero/FeatureSection";
import ClientFeedback from "@/components/hero/ClientFeedback";
import DynamicButton from "@/components/ui/buttons/DynamicButton";
import PageLoader from "@/components/ui/PageLoader";
import { getProducts } from "@/api/product.api";
import { getBanners, type Banner } from "@/api/banner.api";
import { getCategories } from "@/api/category.api";
import { spacing } from "@/utils/spacing";
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
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Store all banners keyed by `slot` so we can use 3 different ones on this page.
  const [bannersBySlot, setBannersBySlot] = useState<Record<string, Banner>>({});

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
      setInitialLoad(false);
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

  // Load all banners once and index them by slot
  const fetchBanners = async () => {
    try {
      const data = await getBanners();
      const map: Record<string, Banner> = {};
      data.forEach((b) => {
        map[b.slot] = b;
      });
      setBannersBySlot(map);
    } catch (err) {
      console.error("Failed to load banners for Landing page", err);
    }
  };

  if (initialLoad) {
    return <PageLoader message="GraceByAnu" />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">

      <Navbar />
      <main className={spacing.navbar.offset}>
        {/* HERO #1: top background hero; uses 'hero-main' banner if available */}
        <section className="p-0 m-0">
          {bannersBySlot["hero-main"] ? (
            <Hero
              title="Welcome to our store"
              subtitle="Discover our latest collections."
              image={bannersBySlot["hero-main"].imageUrl}
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
        </section>
        <section className="max-w-8xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 p-0 m-0">
          {/* <h2 className="text-center text-gray-500 uppercase tracking-wide text-sm">Featured</h2> */}
          {loading ? (
            <ProductGridSkeleton count={5} />
          ) : (
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
          )}


        </section>
        <CategorySection
            categories={categories.map(cat => ({
              title: cat.name,
              image: (cat.icon && cat.icon.trim() !== "") ? cat.icon : "/category.png"
            }))}
          />
        {/* HERO #3: FeatureHero image banner, uses 'hero-tertiary' if set - aligned with products */}
        <section className="p-0 m-0">
           <FeatureHero image={bannersBySlot["hero-tertiary"]?.imageUrl} />
        </section>

        <section className="max-w-8xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 p-0 m-0">
          {loading ? (
            <ProductGridSkeleton count={15} />
          ) : (
            <>
              <ProductGrid
                items={products
                  .slice(0, 15) // Show 3 rows (15 products for desktop with 5 columns)
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
              <div className="flex justify-center mt-2 sm:mt-3">
                <DynamicButton 
                  label="See All" 
                  variant="filled" 
                  shape="pill"
                  onClick={() => navigate("/shop")}
                />
              </div>
            </>
          )}
        </section>
        {/* Offer Section - Commented Out */}
        {/* <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <OfferSection />
        </section> */}
         {/* HERO #2: middle Hero2 section, uses 'hero-secondary' banner - aligned with products */}
         <section className="p-0 m-0">
           <Hero2
             title="Discover new scents"
             subtitle="A selection of fragrances to brighten your mood."
             image={bannersBySlot["hero-secondary"]?.imageUrl || "/hero.png"}
             imagePosition="right"
           />
         </section>
        <section className="max-w-8xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <AtYourService />
        </section>
        {/* Banner at bottom of services section - Full width */}
        <section className="w-full">
          {bannersBySlot["hero-last"] ? (
            <Hero
              title="Discover your natural glow"
              subtitle="Pure essentials for body and mind."
              image={bannersBySlot["hero-last"].imageUrl}
              imagePosition="left"
            />
          ) : (
            <Hero
              title="Discover your natural glow"
              subtitle="Pure essentials for body and mind."
              image="/hero.png"
              imagePosition="left"
            />
          )}
        </section>
        <section className="w-full p-0 m-0">
          <FeatureSection />
        </section>
        {/* Feedback Section - Full Width */}
        <section className="w-full bg-white p-0 m-0">
          <ClientFeedback />
        </section>

      </main>
      <Footer />
    </div>
  );
}
