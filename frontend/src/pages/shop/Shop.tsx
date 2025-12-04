// pages/shop/Shop.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductGrid from "../../components/products/ProductGrid";
import Banner from "@/components/hero/Banner";
import DynamicButton from "@/components/ui/buttons/DynamicButton";
import { getProducts } from "@/api/product.api";

// API product type
interface ApiProduct {
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
  category?: { name: string };
  description?: string;
  currency?: string;
}

// Frontend Product type for display
interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  categoryName: string;
  description?: string;
  currency?: string;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(8);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category"); // category from query

  
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res: ApiProduct[] = await getProducts(); // API returns array

      // map API product to frontend Product type
   const mapped: Product[] = res.map((p) => ({
  id: p._id,
  name: p.name,
  price: p.price,
  discount: p.discount,
  image: [p.image1, p.image2, p.image3, p.image4, p.image5, p.image6].find(
  (img) => img && img.trim() !== "" && img !== "/product.png"
) || "/product.png",

  categoryName: p.category?.name || "Category",
  description: p.description,
  currency: p.currency,
}));
console.log("Products API:", res);
console.log("Mapped Products:", mapped);


      if (selectedCategory) {
        // only show products of selected category
        setProducts(mapped.filter((p) => p.categoryName === selectedCategory));
      } else {
        // show all products
        setProducts(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => setLimit((prev) => prev + 4);
  const displayedProducts = products.slice(0, limit);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <main className="flex-1 py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Banner imageSrc="/hero.png" />

          <div className="flex justify-between items-center mt-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Products
            </h2>
            <DynamicButton label="All" variant="filled" shape="pill" />
          </div>

          <ProductGrid items={displayedProducts} />

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
