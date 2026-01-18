import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AtYourService from "@/components/ui/AtYourService";
import ProductCard from "@/components/products/ProductCard";
import { getBlogs, getBlogCategories, getBlogNiches } from "@/api/blog.api";
import { getProducts } from "@/api/product.api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import { getCompany } from "@/api/company.api";

interface Blog {
  _id: string;
  title: string;
  subTag?: string;
  description?: string;
  image?: string;
  category: string | { _id: string; name: string };
  niche?: string | { _id: string; name: string };
  author: string | { _id: string; name: string; email: string; avatar?: string };
  status: string;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  blogs: number;
}

interface Niche {
  _id: string;
  name: string;
  category: string | { _id: string; name: string };
  blogs: number;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedNiche, setSelectedNiche] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState(16);
  const [companyName, setCompanyName] = useState<string>("Grace by Anu");
  const nicheScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, selectedCategory, selectedNiche]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogsData, categoriesData, nichesData, productsData, companyData] = await Promise.all([
        getBlogs("published"),
        getBlogCategories(),
        getBlogNiches(),
        getProducts(),
        getCompany().catch(() => ({ company: "Grace by Anu" })),
      ]);

      // Filter only published blogs
      const publishedBlogs = blogsData.filter((blog: Blog) => blog.status === "published");
      setBlogs(publishedBlogs);
      setFilteredBlogs(publishedBlogs);

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setNiches(Array.isArray(nichesData) ? nichesData : []);
      setProducts(Array.isArray(productsData) ? productsData.slice(0, 4) : []);
      
      if (companyData?.company) {
        setCompanyName(companyData.company);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => {
        const categoryId = typeof blog.category === "object" ? blog.category._id : blog.category;
        return categoryId === selectedCategory;
      });
    }

    if (selectedNiche !== "all") {
      filtered = filtered.filter((blog) => {
        if (!blog.niche) return false;
        const nicheId = typeof blog.niche === "object" ? blog.niche._id : blog.niche;
        return nicheId === selectedNiche;
      });
    }

    setFilteredBlogs(filtered);
    setDisplayCount(16); // Reset display count when filter changes
  };

  const scrollNiches = (direction: "left" | "right") => {
    if (nicheScrollRef.current) {
      const scrollAmount = 200;
      nicheScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const getCategoryName = (category: string | { _id: string; name: string }) => {
    return typeof category === "object" ? category.name : "";
  };

  const getNicheName = (niche?: string | { _id: string; name: string }) => {
    if (!niche) return "";
    return typeof niche === "object" ? niche.name : "";
  };

  const getBlogImage = (blog: Blog) => {
    if (blog.image && blog.image.trim() !== "" && blog.image !== "/product.png") {
      return blog.image.startsWith("http") ? blog.image : `${import.meta.env.VITE_API_URL?.replace("/api", "")}${blog.image}`;
    }
    return "/product.png";
  };

  if (initialLoad && loading) {
    return <PageLoader message="GraceByAnu" />;
  }

  // Get niches for selected category
  const categoryNiches = selectedCategory !== "all" 
    ? niches.filter((niche) => {
        const categoryId = typeof niche.category === "object" ? niche.category._id : niche.category;
        return categoryId === selectedCategory;
      })
    : [];

  const displayedBlogs = filteredBlogs.slice(0, displayCount);
  const hasMore = filteredBlogs.length > displayCount;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header Section */}
      <div className="w-full">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
          <h1 className="text-4xl md:text-5xl font-bold theme-heading mb-2 text-center">
            Blogs
          </h1>
          <p className="text-lg text-gray-600 mb-6 text-center">
            Legal page details Sub Title
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedNiche("all");
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === "all"
                  ? "bg-[#8B5E3C] text-white"
                  : "bg-[#F5E6D3] text-gray-700 hover:bg-[#E8D4B8]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  setSelectedNiche("all");
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat._id
                    ? "bg-[#8B5E3C] text-white"
                    : "bg-[#F5E6D3] text-gray-700 hover:bg-[#E8D4B8]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Horizontal Line */}
          <div className="w-full h-px bg-gray-300 my-4"></div>

          {/* Niches Scroll */}
          {selectedCategory !== "all" && categoryNiches.length > 0 && (
            <div className="relative mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollNiches("left")}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors flex-shrink-0 z-10"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div
                  ref={nicheScrollRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <button
                    onClick={() => setSelectedNiche("all")}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedNiche === "all"
                        ? "bg-[#8B5E3C] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    All
                  </button>
                  {categoryNiches.map((niche) => (
                    <button
                      key={niche._id}
                      onClick={() => setSelectedNiche(niche._id)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        selectedNiche === niche._id
                          ? "bg-[#8B5E3C] text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {niche.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => scrollNiches("right")}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors flex-shrink-0 z-10"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading blogs...</p>
          </div>
        ) : displayedBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No blogs found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              {displayedBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog._id}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* Blog Image */}
                    <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={getBlogImage(blog)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/product.png";
                        }}
                      />
                    </div>
                    {/* Blog Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {formatDate(blog.createdAt)}
                      </p>
                      {blog.niche && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {getNicheName(blog.niche)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setDisplayCount(displayCount + 16)}
                  className="px-6 py-3 bg-[#8B5E3C] text-white rounded-lg hover:bg-[#6B4A2C] transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Service Features */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 md:py-8 lg:py-10">
        <AtYourService />
      </section>

      {/* Popular Products */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold theme-heading">Popular Products</h2>
        </div>
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                id={p._id}
                name={p.name}
                price={p.price}
                image={p.image1 || "/product.png"}
                offer={p.discount ? `${p.discount}% OFF` : undefined}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
