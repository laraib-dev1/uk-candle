// pages/shop/Shop.tsx
import React, { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductGrid from "../../components/products/ProductGrid";
import Banner from "@/components/hero/Banner";
import DynamicButton from "@/components/ui/buttons/DynamicButton";

const sampleProducts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Product ${i + 1}`,
  price: 50 + i * 5,
}));

const Shop = () => {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(8);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setLimit((prev) => prev + 4);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 my-20">
          
          <Banner imageSrc="/hero.png"/>
          <div className="flex justify-between items-center mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <DynamicButton label="All" variant="filled" shape="pill" />
          </div>

          <ProductGrid items={sampleProducts} limit={limit} />

          <div className="flex justify-center mt-10">
            <DynamicButton
              label="Load More"
              loading={loading}
              onClick={handleLoadMore}
              variant="transparent"
              shape="rounded"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
