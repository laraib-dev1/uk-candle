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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageLoader from "@/components/ui/PageLoader";
import Pagination from "@/components/ui/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [shopBanner, setShopBanner] = useState<BannerType | null>(null);
  
  // Products per page: 20 products = 4 rows (5 products per row on large screen)
  const PRODUCTS_PER_PAGE = 20;

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category"); // category from query

  
  useEffect(() => {
    fetchProducts();
    fetchBanners();
    fetchCategories();
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

      // Store all products
      setAllProducts(mapped);

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
      setInitialLoad(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
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

  // Calculate pagination
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const displayedProducts = products.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (initialLoad && loading) {
    return <PageLoader message="Loading products..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <main className="flex-1 py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Shop banner – if admin configured one, use it, otherwise use default image */}
          <Banner imageSrc={shopBanner?.imageUrl || "/hero.png"} />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10 mb-6 gap-4">
            <h2 className="text-2xl font-bold theme-heading">
              Products
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => {
                  if (value === "all") {
                    navigate("/shop");
                  } else {
                    navigate(`/shop?category=${encodeURIComponent(value)}`);
                  }
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-white border border-gray-300 rounded-full px-4 py-2" style={{ overflow: 'hidden' }}>
                  <span className="flex items-center justify-between min-w-0 w-full" style={{ maxWidth: 'calc(100% - 24px)' }}>
                    <SelectValue placeholder="Select Category" />
                    <span className="text-xs text-gray-500 ml-auto shrink-0 whitespace-nowrap">
                      {selectedCategory === "all" || !selectedCategory
                        ? `(${allProducts.length})`
                        : `(${allProducts.filter((p) => p.categoryName === selectedCategory).length})`}
                    </span>
                  </span>
                </SelectTrigger>
                <SelectContent 
                  side="bottom" 
                  align="end" 
                  position="popper" 
                  sideOffset={4}
                  avoidCollisions={false}
                >
                  <SelectItem value="all" className="relative group">
                    <span className="flex-1 min-w-0 truncate pr-2">All</span>
                    <span className="absolute right-2 text-xs text-gray-500 whitespace-nowrap group-data-[state=checked]:hidden">
                      {/* ({allProducts.length}) */}
                    </span>
                  </SelectItem>
                  {categories.map((category) => {
                    const count = allProducts.filter(
                      (p) => p.categoryName === category.name
                    ).length;
                    return (
                      <SelectItem key={category._id} value={category.name} className="relative group">
                        <span className="flex-1 min-w-0 truncate pr-2">{category.name}</span>
                        <span className="absolute right-2 text-xs text-gray-500 whitespace-nowrap group-data-[state=checked]:hidden">
                          ({count})
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && !initialLoad ? (
            <ProductGridSkeleton count={PRODUCTS_PER_PAGE} />
          ) : (
            <>
              <ProductGrid items={displayedProducts} />
              
              {/* Pagination */}
              {products.length > PRODUCTS_PER_PAGE && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={products.length}
                  itemsPerPage={PRODUCTS_PER_PAGE}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
