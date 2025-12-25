// pages/shop/Shop.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductGrid from "../../components/products/ProductGrid";
import { ProductGridSkeleton } from "../../components/products/ProductGridSkeleton";
import Banner from "@/components/hero/Banner";
import DynamicButton from "@/components/ui/buttons/DynamicButton";
import { getProducts } from "@/api/product.api";
import { getBanners, type Banner as BannerType } from "@/api/banner.api";
import { getCategories } from "@/api/category.api";
import PageLoader from "@/components/ui/PageLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface Category {
  _id: string;
  name: string;
  icon?: string;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [limit, setLimit] = useState(8);
  const [shopBanner, setShopBanner] = useState<BannerType | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const selectedCategoryFromUrl = params.get("category"); // category from query
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategoryFromUrl || "all");

  
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchBanners();
  }, []);

  useEffect(() => {
    // Update selected category when URL changes
    if (selectedCategoryFromUrl) {
      setSelectedCategory(selectedCategoryFromUrl);
    } else {
      setSelectedCategory("all");
    }
  }, [selectedCategoryFromUrl]);

  useEffect(() => {
    // Filter products when category changes
    if (selectedCategory === "all") {
      setProducts(allProducts);
    } else {
      setProducts(allProducts.filter((p) => p.categoryName === selectedCategory));
    }
    setLimit(8); // Reset limit when category changes
  }, [selectedCategory, allProducts]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

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

      setAllProducts(mapped);
      
      // Filter based on selected category
      if (selectedCategory === "all") {
        setProducts(mapped);
      } else {
        setProducts(mapped.filter((p) => p.categoryName === selectedCategory));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === "all") {
      navigate("/shop");
    } else {
      navigate(`/shop?category=${encodeURIComponent(value)}`);
    }
  };

  // Load banner that appears at the top of the Shop page
  const fetchBanners = async () => {
    try {
      const data = await getBanners();
      const banner = data.find((b) => b.slot === "shop-main");
      setShopBanner(banner || null);
    } catch (err) {
      console.error("Failed to load banners for Shop page", err);
    }
  };

  const handleLoadMore = () => setLimit((prev) => prev + 4);
  const displayedProducts = products.slice(0, limit);

  if (initialLoad && loading) {
    return <PageLoader message="Loading products..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <main className="flex-1 py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Shop banner – if admin configured one, use it, otherwise use default image */}
          <Banner 
            imageSrc={shopBanner?.imageUrl || "/hero.png"}
            targetUrl={shopBanner?.targetUrl}
          />

          <div className="flex justify-between items-center mt-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Products
            </h2>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px] bg-white text-black border-gray-300">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all" className="text-black hover:bg-gray-100 focus:bg-gray-100">
                  All Categories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem 
                    key={category._id} 
                    value={category.name}
                    className="text-black hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && !initialLoad ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <ProductGrid items={displayedProducts} />
          )}

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
