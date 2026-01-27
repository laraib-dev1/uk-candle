import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TableOfContents } from "@/components/ui/TableOfContents";
import ProductCard from "@/components/products/ProductCard";
import { getBlogById, getBlogCategories, getBlogs } from "@/api/blog.api";
import { getProducts } from "@/api/product.api";
import { getCompany } from "@/api/company.api";
import PageLoader from "@/components/ui/PageLoader";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Share2 } from "lucide-react";
import { FaPinterest } from "react-icons/fa";
import FeatureCards from "@/components/ui/FeatureCards";
import { spacing } from "@/utils/spacing";
import { getCachedData, setCachedData, CACHE_KEYS } from "@/utils/cache";

interface Blog {
  _id: string;
  title: string;
  subTag?: string;
  description?: string;
  image?: string;
  category: string | { _id: string; name: string };
  niche?: string | { _id: string; name: string };
  author: string | { _id: string; name: string; email: string; avatar?: string; bio?: string; socialLinks?: any };
  status: string;
  createdAt: string;
  views?: number;
}

interface Category {
  _id: string;
  name: string;
  blogs: number;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [companyName, setCompanyName] = useState<string>("Grace by Anu");
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [companyDescription, setCompanyDescription] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to load from cache first for faster initial render
      const cachedBlog = getCachedData<Blog>(`${CACHE_KEYS.BLOG_DETAIL}_${id}`);
      const cachedCategories = getCachedData<Category[]>(CACHE_KEYS.BLOG_CATEGORIES);
      const cachedProducts = getCachedData<any[]>(CACHE_KEYS.PRODUCTS);
      const cachedCompany = getCachedData<any>(CACHE_KEYS.COMPANY);

      // Use cached data immediately if available
      if (cachedBlog) {
        setBlog(cachedBlog);
      }
      if (cachedCategories) {
        setCategories(cachedCategories);
      }
      if (cachedProducts) {
        setProducts(cachedProducts.slice(0, 4));
      }
      if (cachedCompany) {
        setCompanyName(cachedCompany.company || "Grace by Anu");
        setCompanyLogo(cachedCompany.logo || "");
        setCompanyDescription(cachedCompany.description || "");
      }

      // Fetch fresh data in background and update cache
      const [blogData, categoriesData, productsData, companyData] = await Promise.all([
        getBlogById(id!),
        getBlogCategories(),
        getProducts(),
        getCompany().catch(() => ({ company: "Grace by Anu", logo: "" })),
      ]);

      setBlog(blogData);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setProducts(Array.isArray(productsData) ? productsData.slice(0, 4) : []);
      
      if (companyData) {
        setCompanyName(companyData.company || "Grace by Anu");
        setCompanyLogo(companyData.logo || "");
        setCompanyDescription(companyData.description || "");
      }

      // Cache the data (24 hours)
      setCachedData(`${CACHE_KEYS.BLOG_DETAIL}_${id}`, blogData);
      setCachedData(CACHE_KEYS.BLOG_CATEGORIES, Array.isArray(categoriesData) ? categoriesData : []);
      setCachedData(CACHE_KEYS.PRODUCTS, productsData || []);
      setCachedData(CACHE_KEYS.COMPANY, companyData);
    } catch (err) {
      console.error("Failed to fetch blog:", err);
      // Try to use cached data as fallback
      const cachedBlog = getCachedData<Blog>(`${CACHE_KEYS.BLOG_DETAIL}_${id}`);
      if (cachedBlog) {
        setBlog(cachedBlog);
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
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

  const getAuthorName = (author: string | { _id: string; name: string; email: string; avatar?: string; bio?: string }) => {
    return typeof author === "object" ? author.name : "";
  };

  const getAuthorAvatar = (author: string | { _id: string; name: string; email: string; avatar?: string }) => {
    if (typeof author === "object" && author.avatar) {
      return author.avatar.startsWith("http") ? author.avatar : `${import.meta.env.VITE_API_URL?.replace("/api", "")}${author.avatar}`;
    }
    return "";
  };

  const getAuthorBio = (author: string | { _id: string; name: string; email: string; avatar?: string; bio?: string }) => {
    return typeof author === "object" ? author.bio || "" : "";
  };

  const getAuthorSocialLinks = (author: string | { _id: string; name: string; email: string; avatar?: string; socialLinks?: any }) => {
    if (typeof author === "object" && author.socialLinks) {
      return {
        facebook: author.socialLinks.facebook || "",
        instagram: author.socialLinks.instagram || "",
        youtube: author.socialLinks.youtube || "",
        linkedin: author.socialLinks.linkedin || "",
        tiktok: author.socialLinks.tiktok || "",
        other: author.socialLinks.other || "",
      };
    }
    return {};
  };

  const getBlogImage = () => {
    if (blog?.image && blog.image.trim() !== "" && blog.image !== "/product.png") {
      return blog.image.startsWith("http") ? blog.image : `${import.meta.env.VITE_API_URL?.replace("/api", "")}${blog.image}`;
    }
    return "/product.png";
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = blog?.title || "";
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  if (initialLoad && loading) {
    return <PageLoader message="GraceByAnu" />;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className={`text-center py-20 ${spacing.navbar.offset}`}>
          <p className="text-gray-600">Blog not found</p>
          <Link to="/blogs" className="text-[#8B5E3C] hover:underline mt-4 inline-block">
            Back to Blogs
          </Link>
        </div>
        <section className={`w-full ${spacing.footer.gapTop}`}>
          <Footer />
        </section>
      </div>
    );
  }

  const authorSocialLinks = getAuthorSocialLinks(blog.author);
  const categoryName = getCategoryName(blog.category);
  const nicheName = getNicheName(blog.niche);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        .content-area p[style*="text-align"],
        .content-area div[style*="text-align"],
        .content-area h1[style*="text-align"],
        .content-area h2[style*="text-align"],
        .content-area h3[style*="text-align"],
        .content-area h4[style*="text-align"],
        .content-area h5[style*="text-align"],
        .content-area h6[style*="text-align"],
        .content-area span[style*="text-align"],
        .content-area [style*="text-align"] {
          text-align: inherit !important;
        }
        .content-area [style*="text-align: center"],
        .content-area [style*="text-align:center"] {
          text-align: center !important;
        }
        .content-area [style*="text-align: right"],
        .content-area [style*="text-align:right"] {
          text-align: right !important;
        }
        .content-area [style*="text-align: justify"],
        .content-area [style*="text-align:justify"] {
          text-align: justify !important;
        }
        .content-area [style*="text-align: left"],
        .content-area [style*="text-align:left"] {
          text-align: left !important;
        }
      `}</style>
      <Navbar />
      <main className={spacing.navbar.offset}>
        {/* Header Section */}
        <section className={`w-full ${spacing.section.gap}`}>
          <div className="max-w-[1232px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className={spacing.container.paddingXLarge}>
              <h1 className={`text-4xl md:text-5xl font-bold theme-heading text-center ${spacing.inner.gapBottom}`}>
                Blog Details
              </h1>
              
              {/* Breadcrumb */}
              <div className={`text-sm text-gray-600 text-center ${spacing.inner.gapBottom}`}>
              <Link to="/blogs" className="hover:underline">Blogs</Link>
              {categoryName && (
                <>
                  {" / "}
                  <Link 
                    to={`/blogs?category=${encodeURIComponent(typeof blog.category === "object" ? blog.category._id : blog.category)}`} 
                    className="hover:underline"
                  >
                    {categoryName}
                  </Link>
                </>
              )}
              {nicheName && (
                <>
                  {" / "}
                  <Link 
                    to={`/blogs?category=${encodeURIComponent(typeof blog.category === "object" ? blog.category._id : blog.category)}&niche=${encodeURIComponent(typeof blog.niche === "object" ? blog.niche._id : blog.niche || "")}`} 
                    className="hover:underline"
                  >
                    {nicheName}
                  </Link>
                </>
              )}
              {" / "}
              <span className="text-gray-900">{blog.title}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className={`w-full ${spacing.section.gap}`}>
          <div className="max-w-[1232px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className={spacing.container.paddingXLarge}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content Area */}
                <div className="flex-1">
            {/* Blog Image */}
            {blog.image && (
              <div className="w-full mb-6 rounded-lg overflow-hidden">
                <img
                  src={getBlogImage()}
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/product.png";
                  }}
                />
              </div>
            )}

            {/* Blog Title */}
            <h1 className="text-3xl md:text-4xl font-bold theme-heading mb-4 text-gray-900">
              {blog.title}
            </h1>

            {/* Author and Date */}
            <div className="flex items-center gap-4 mb-6 text-gray-600">
              <span>By {getAuthorName(blog.author)}</span>
              <span>•</span>
              <span>Date {formatDate(blog.createdAt)}</span>
            </div>

            {/* Blog Content */}
            <div
              ref={contentRef}
              className="prose prose-lg max-w-none text-gray-700 relative content-area"
              dangerouslySetInnerHTML={{ __html: blog.description || "<p>No content available.</p>" }}
            />

            {/* Horizontal Line - End of Blog Content */}
            <div className="border-t border-gray-300 mt-8"></div>

            {/* Sharing Options */}
            <div className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Share Your Love!</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166FE5] transition-colors"
                  title="Share on Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:bg-[#1A91DA] transition-colors"
                  title="Share on Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#0077B5] text-white flex items-center justify-center hover:bg-[#006399] transition-colors"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href={socialLinks.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#BD081C] text-white flex items-center justify-center hover:bg-[#A00718] transition-colors"
                  title="Share on Pinterest"
                >
                  <FaPinterest size={20} />
                </a>
                {typeof navigator.share === 'function' && (
                  <button
                    onClick={handleNativeShare}
                    className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                    title="Share"
                  >
                    <Share2 size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Author Profile - Commented out as requested, will use later */}
            {/* {typeof blog.author === "object" && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-start gap-4">
                  {getAuthorAvatar(blog.author) && (
                    <img
                      src={getAuthorAvatar(blog.author)}
                      alt={getAuthorName(blog.author)}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/product.png";
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{getAuthorName(blog.author)}</h4>
                    {getAuthorBio(blog.author) && (
                      <p className="text-sm text-gray-600 mb-3">{getAuthorBio(blog.author)}</p>
                    )}
                    {(authorSocialLinks.facebook || authorSocialLinks.instagram || authorSocialLinks.youtube || authorSocialLinks.linkedin) && (
                      <div className="flex gap-2">
                        {authorSocialLinks.facebook && (
                          <a
                            href={authorSocialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166FE5] transition-colors"
                          >
                            <Facebook size={14} />
                          </a>
                        )}
                        {authorSocialLinks.instagram && (
                          <a
                            href={authorSocialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                          >
                            <Instagram size={14} />
                          </a>
                        )}
                        {authorSocialLinks.youtube && (
                          <a
                            href={authorSocialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:bg-[#CC0000] transition-colors"
                          >
                            <Youtube size={14} />
                          </a>
                        )}
                        {authorSocialLinks.linkedin && (
                          <a
                            href={authorSocialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#0077B5] text-white flex items-center justify-center hover:bg-[#006399] transition-colors"
                          >
                            <Linkedin size={14} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )} */}
                </div>

                {/* Right Sidebar - Fixed on large screens */}
                <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
                  <div className="lg:sticky lg:top-20">
                    {/* Table of Contents */}
                    {blog.description && (
                      <div className="mb-6">
                        <TableOfContents htmlContent={blog.description} contentRef={contentRef} />
                      </div>
                    )}

                    {/* Share Options */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                        Share Your Love!
                      </h3>
                      <div className="flex flex-col gap-2">
                        <a
                          href={socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1877F2] text-white hover:bg-[#166FE5] transition-colors text-sm"
                        >
                          <Facebook size={16} />
                          Facebook
                        </a>
                        <a
                          href={socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#1A91DA] transition-colors text-sm"
                        >
                          <Twitter size={16} />
                          Twitter
                        </a>
                        <a
                          href={socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0077B5] text-white hover:bg-[#006399] transition-colors text-sm"
                        >
                          <Linkedin size={16} />
                          LinkedIn
                        </a>
                        <a
                          href={socialLinks.pinterest}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#BD081C] text-white hover:bg-[#A00718] transition-colors text-sm"
                        >
                          <FaPinterest size={16} />
                          Pinterest
                        </a>
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                        {companyName}
                      </h3>
                      {companyLogo && (
                        <img
                          src={companyLogo.startsWith("http") ? companyLogo : `${import.meta.env.VITE_API_URL?.replace("/api", "")}${companyLogo}`}
                          alt={companyName}
                          className="w-full h-auto mb-3 rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                      <p className="text-sm text-gray-600">
                        {companyDescription || `${companyName} - Your trusted source for quality products and insights.`}
                      </p>
                    </div>

                    {/* Explore Topics */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                        Explore Topics
                      </h3>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <Link
                            key={cat._id}
                            to={`/blogs?category=${cat._id}`}
                            className="flex items-center justify-between gap-3 text-sm text-gray-700 hover:text-[#8B5E3C] hover:underline transition-colors px-2 py-1 rounded"
                          >
                            <span className="leading-5">{cat.name}</span>
                            <span className="text-xs text-gray-500 whitespace-nowrap leading-5">({cat.blogs || 0})</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className={`w-full ${spacing.section.gap}`}>
          <div className="max-w-[1232px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className={spacing.container.paddingXLarge}>
              <FeatureCards />
            </div>
          </div>
        </section>

        {/* Popular Products */}
        <section className={`w-full ${spacing.section.gap}`}>
          <div className="max-w-[1232px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className={spacing.container.paddingXLarge}>
              <h2 className={`text-2xl font-bold theme-heading ${spacing.inner.gapBottom}`}>Popular Products</h2>
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
            </div>
          </div>
        </section>
      </main>
      <section className={`w-full ${spacing.footer.gapTop}`}>
        <Footer />
      </section>
    </div>
  );
}
