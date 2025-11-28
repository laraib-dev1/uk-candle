// pages/shop/Shop.tsx
import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductGrid from "../../components/products/ProductGrid";
import Banner from "@/components/hero/Banner";
import DynamicButton from "@/components/ui/buttons/DynamicButton";
import { getProducts } from "@/api/product.api";

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image?: string; // image URL from backend
  description?: string;
  currency?: string;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(8);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
  try {
    setLoading(true);
    const data = await getProducts();

    // Map _id to id for ProductCard
    const mapped = data.map((p: any) => ({
      ...p,
      id: p._id, // crucial
    }));

    setProducts(mapped);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


   const handleLoadMore = () => {
    setLimit((prev) => prev + 4);
  };

  const displayedProducts = products.slice(0, limit);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Main container with consistent spacing */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Banner */}
          <Banner imageSrc="/hero.png" />

          {/* Products header */}
          <div className="flex justify-between items-center mt-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h2>
            <DynamicButton label="All" variant="filled" shape="pill" />
          </div>

          {/* Product grid */}
          <ProductGrid items={displayedProducts} />

          {/* Load more button */}
          {limit < products.length && (
            <div className="flex justify-center mt-10">
              <DynamicButton
                label="Load More"
                loading={loading}
                onClick={handleLoadMore}
                variant="transparent"
                shape="rounded"
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
