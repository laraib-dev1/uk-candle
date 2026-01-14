import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Flag,
  RotateCcw,
  Headphones,
  Truck,
  Heart,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { addToWishlist, removeFromWishlist, getUserWishlist } from "@/api/user.api";
import { useToast } from "@/components/ui/toast";
import CircularLoader from "@/components/ui/CircularLoader";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import AddToCartButton from "@/components/ui/buttons/AddToCartButton";
import SocialShare from "@/components/products/SocialShare";
import ProductCard from "@/components/products/ProductCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getProduct, getProducts } from "@/api/product.api";
import { getCompany } from "@/api/company.api";
import { getBanners } from "@/api/banner.api";
import PageLoader from "@/components/ui/PageLoader";

/* =======================
   Types
======================= */
interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  images?: string[];
  category?: any;
  categoryName?: string;
  metaFeatures?: string;
  metaInfo?: string;
  video1?: string;
  video2?: string;
  stock?: number;
  [key: string]: any;
}

/* =======================
   Component
======================= */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [companyName, setCompanyName] = useState<string>("Grace by Anu");
  const [heroBannerImage, setHeroBannerImage] = useState<string | undefined>(undefined);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | undefined>(undefined);

  /* =======================
     Fetch Single Product
  ======================= */
  useEffect(() => {
    if (!id) return;

    // Scroll to top when product changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);

        const images = [
          data.image1,
          data.image2,
          data.image3,
          data.image4,
          data.image5,
          data.image6,
        ].filter(img => 
          img && 
          img.trim() !== "" && 
          img !== "/product.png" && 
          !img.includes("placeholder") &&
          !img.includes("wqwwwq")
        );

        const categoryName = data.categoryName || data.category?.name || data.category || null;
        setProduct({
          ...data,
          images,
          categoryName: categoryName,
          category: data.category || null,
          name: data.name || "Product",
          metaFeatures: data.metaFeatures || "",
          metaInfo: data.metaInfo || "",
        });
      } catch (err) {
        console.error("PRODUCT FETCH ERROR:", err);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* =======================
     Fetch Hero Banner for Social Share
  ======================= */
  useEffect(() => {
    const fetchHeroBanner = async () => {
      try {
        const banners = await getBanners();
        const heroBanner = banners.find((b) => b.slot === "hero-main");
        if (heroBanner && heroBanner.imageUrl) {
          setHeroBannerImage(heroBanner.imageUrl);
        }
      } catch (err) {
        console.error("Failed to fetch hero banner:", err);
      }
    };
    fetchHeroBanner();
  }, []);

  /* =======================
     Fetch All Products
  ======================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const products = await getProducts();
        const mapped = products.map((p: any) => ({
          ...p,
          images: [
            p.image1,
            p.image2,
            p.image3,
          ].filter(Boolean),
          categoryName: p.category?.name,
        }));
        setAllProducts(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, []);

  /* =======================
     Fetch Company Name and Logo
  ======================= */
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompany();
        if (data?.company) {
          setCompanyName(data.company);
        }
        if (data?.logo) {
          setCompanyLogoUrl(data.logo);
        }
      } catch (err) {
        console.error("Failed to load company:", err);
      }
    };

    fetchCompany();
  }, []);

  /* =======================
     Handle Broken Images and Remove Backgrounds in Meta Info
  ======================= */
  useEffect(() => {
    if (product) {
      // Wait for DOM to update, then handle broken images and backgrounds
      setTimeout(() => {
        const metaInfoDiv = document.querySelector('.meta-info-content');
        const metaFeaturesContainer = document.querySelector('.meta-features-container');
        
        // Remove backgrounds from all elements in meta info
        if (metaInfoDiv) {
          const allElements = metaInfoDiv.querySelectorAll('*');
          allElements.forEach((el) => {
            (el as HTMLElement).style.backgroundColor = 'transparent';
            (el as HTMLElement).style.background = 'transparent';
            (el as HTMLElement).style.backgroundImage = 'none';
          });
          
          // Also handle broken images
          const images = metaInfoDiv.querySelectorAll('img');
          images.forEach((img) => {
            img.onerror = () => {
              img.style.display = 'none';
            };
            // Check if image is already broken
            if (!img.complete || img.naturalHeight === 0) {
              img.style.display = 'none';
            }
          });
        }
        
        // Remove backgrounds and set headings to theme primary color in meta features container
        if (metaFeaturesContainer) {
          const allElements = metaFeaturesContainer.querySelectorAll('*');
          allElements.forEach((el) => {
            (el as HTMLElement).style.backgroundColor = 'transparent';
            (el as HTMLElement).style.background = 'transparent';
            (el as HTMLElement).style.backgroundImage = 'none';
            // Set headings to theme primary color
            const tagName = el.tagName?.toLowerCase();
            if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
              (el as HTMLElement).style.color = 'var(--theme-primary)';
            } else {
              (el as HTMLElement).style.color = 'black';
            }
          });
        }
        
        // Also set headings in meta-info-content to theme primary color and ensure all text is readable
        if (metaInfoDiv) {
          const headings = metaInfoDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headings.forEach((heading) => {
            (heading as HTMLElement).style.color = 'var(--theme-primary)';
          });
          
          // Ensure all text elements are readable (not white on white background)
          const allTextElements = metaInfoDiv.querySelectorAll('p, span, div, li, td, th, a');
          allTextElements.forEach((el) => {
            const computedStyle = window.getComputedStyle(el);
            const color = computedStyle.color;
            const bgColor = computedStyle.backgroundColor;
            
            // If text color is white or very light, make it black
            if (color === 'rgb(255, 255, 255)' || color === 'white' || 
                (color.includes('rgb') && color.includes('255, 255, 255'))) {
              (el as HTMLElement).style.color = '#000000';
            }
            
            // If background is white and text is white, make text black
            if (bgColor === 'rgb(255, 255, 255)' || bgColor === 'white') {
              if (color === 'rgb(255, 255, 255)' || color === 'white') {
                (el as HTMLElement).style.color = '#000000';
              }
            }
          });
        }
      }, 100);
    }
  }, [product]);

  /* =======================
     Helper: Get Absolute Image URL
  ======================= */
  const getAbsoluteImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl || imageUrl === "/product.png" || imageUrl.trim() === "") {
      // Return absolute URL for default product image
      return `${window.location.origin}/product.png`;
    }
    
    // If already absolute URL (from API mapImages function), return as is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    
    // If relative URL, make it absolute using API URL
    const apiUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || window.location.origin;
    if (imageUrl.startsWith("/")) {
      return `${apiUrl}${imageUrl}`;
    }
    
    // If relative path without leading slash
    return `${apiUrl}/${imageUrl}`;
  };

  /* =======================
     Helper: Clean Description for Meta Tags
  ======================= */
  const cleanDescription = (desc: string | undefined, productName: string): string => {
    if (!desc) return `${productName} - Available at ${companyName}`;
    
    // Remove HTML tags and decode HTML entities
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = desc;
    let text = tempDiv.textContent || tempDiv.innerText || "";
    
    // Trim and limit length (OG description should be max 200 chars)
    text = text.trim().replace(/\s+/g, " ");
    if (text.length > 200) {
      text = text.substring(0, 197) + "...";
    }
    
    return text || `${productName} - Available at ${companyName}`;
  };

  // Set meta tags in document head (must be before early return to follow Rules of Hooks)
  useEffect(() => {
    if (!product) return;

    // Use hero banner image for social sharing (priority), fallback to product image
    const imageToUse = heroBannerImage || product.images?.[0];
    const ogImageUrl = getAbsoluteImageUrl(imageToUse);
    const ogDescription = cleanDescription(product.description, product.name);
    const pageTitle = `${product.name} | ${companyName}`;

    console.log("🔍 Product Meta Tags Debug:", {
      productName: product.name,
      productDescription: product.description,
      cleanedDescription: ogDescription,
      productImages: product.images,
      firstImage: product.images?.[0],
      heroBannerImage: heroBannerImage,
      imageUsed: imageToUse,
      ogImageUrl: ogImageUrl,
      companyName: companyName,
      pageUrl: window.location.href,
    });

    // Set meta tags directly in document head as fallback for crawlers
    const setMetaTag = (property: string, content: string, isProperty = true) => {
      if (!content || content.trim() === "") {
        console.warn(`⚠️ Empty content for meta tag: ${property}`);
        return;
      }
      
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Verify image URL is accessible
    if (ogImageUrl) {
      const img = new Image();
      img.onload = () => console.log("✅ Product image is accessible:", ogImageUrl);
      img.onerror = () => console.error("❌ Product image failed to load:", ogImageUrl);
      img.src = ogImageUrl;
    }

    // Set all OG tags directly
    setMetaTag("og:title", product.name);
    setMetaTag("og:description", ogDescription);
    setMetaTag("og:image", ogImageUrl);
    setMetaTag("og:image:secure_url", ogImageUrl);
    setMetaTag("og:image:width", "1200");
    setMetaTag("og:image:height", "630");
    setMetaTag("og:image:alt", product.name);
    setMetaTag("og:url", window.location.href);
    setMetaTag("og:type", "product");
    setMetaTag("og:site_name", companyName);
    setMetaTag("product:price:amount", product.price.toString());
    setMetaTag("product:price:currency", "PKR");
    
    // Set Twitter tags
    setMetaTag("twitter:card", "summary_large_image", false);
    setMetaTag("twitter:title", product.name, false);
    setMetaTag("twitter:description", ogDescription, false);
    setMetaTag("twitter:image", ogImageUrl, false);
    setMetaTag("twitter:image:alt", product.name, false);
    
    // Set description
    setMetaTag("description", ogDescription, false);
    
    // Set title
    document.title = pageTitle;

    // Verify meta tags are set (for debugging)
    setTimeout(() => {
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
      const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute("content");
      
      console.log("✅ Meta Tags Verification:", {
        ogTitle: ogTitle || "❌ MISSING",
        ogImage: ogImage || "❌ MISSING",
        ogDescription: ogDesc || "❌ MISSING",
        allMetaTags: Array.from(document.querySelectorAll("meta[property^='og:'], meta[name^='twitter:']")).map(m => ({
          attr: m.getAttribute("property") || m.getAttribute("name"),
          content: m.getAttribute("content")
        }))
      });

      if (!ogTitle || !ogImage || !ogDesc) {
        console.error("❌ CRITICAL: Some meta tags are missing! Social media crawlers won't see them.");
        console.error("💡 Solution: You need server-side rendering (SSR) or pre-rendering for social media sharing to work.");
      }
    }, 100);
  }, [product, companyName, heroBannerImage]);

  if (initialLoad && (loading || !product)) {
    return <PageLoader message="Loading product..." />;
  }

  if (!product) {
    return <PageLoader message="Loading product..." />;
  }

  /* =======================
     Derived Data
  ======================= */
  const discountedPrice = product.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  const similarProducts = allProducts
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  // Calculate meta tags for Helmet (use hero banner if available, else product image)
  const imageForMeta = heroBannerImage || product?.images?.[0];
  const metaImageUrl = product ? getAbsoluteImageUrl(imageForMeta) : "";
  const metaDescription = product ? cleanDescription(product.description, product.name) : "";
  const metaTitle = product ? `${product.name} | ${companyName}` : companyName;

  // No need to parse - display as HTML like metaInfo

  // Clean HTML content to remove broken images and backgrounds
  const cleanHtmlContent = (html: string | undefined) => {
    if (!html) return "";
    // Remove img tags with empty src, invalid src, or placeholder text
    let cleaned = html
      .replace(/<img[^>]*src\s*=\s*["']?[^"'>]*["']?[^>]*>/gi, (match) => {
        // Check if image src contains placeholder indicators
        if (match.includes('wqwwwq') || match.includes('placeholder') || !match.match(/src\s*=\s*["']([^"']+)["']/)) {
          return '';
        }
        return match;
      })
      .replace(/<img[^>]*>/gi, (match) => {
        // Remove images without proper src
        if (!match.match(/src\s*=\s*["']([^"']+)["']/)) {
          return '';
        }
        return match;
      });
    
    // Remove background styles from all elements
    cleaned = cleaned.replace(/style\s*=\s*["'][^"']*background[^"']*["']/gi, (match) => {
      // Remove background-related styles
      const styleContent = match.match(/style\s*=\s*["']([^"']+)["']/)?.[1] || '';
      const cleanedStyle = styleContent
        .split(';')
        .filter(prop => !prop.trim().toLowerCase().includes('background'))
        .join(';');
      return cleanedStyle ? `style="${cleanedStyle}"` : '';
    });
    
    // Remove background-color specifically
    cleaned = cleaned.replace(/background-color\s*:\s*[^;]+;?/gi, '');
    cleaned = cleaned.replace(/background\s*:\s*[^;]+;?/gi, '');
    
    return cleaned;
  };

  // Wishlist Button Component
  const WishlistButtonComponent = ({ productId }: { productId: string }) => {
    const { user } = useAuth();
    const { success, error } = useToast();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
      // Check if product is in wishlist
      const checkWishlistStatus = async () => {
        // Check both user and token to prevent unnecessary API calls
        const token = localStorage.getItem("token");
        if (!user || !token) {
          setIsInWishlist(false);
          return;
        }
        try {
          const wishlist = await getUserWishlist();
          const isInList = Array.isArray(wishlist) && wishlist.some((item: any) => 
            item._id === productId || item.product?._id === productId || item === productId
          );
          setIsInWishlist(isInList);
        } catch (err: any) {
          // Silently handle all errors - getUserWishlist already handles 401s
          setIsInWishlist(false);
        }
      };
      checkWishlistStatus();
    }, [productId, user]);

    const handleWishlistToggle = async () => {
      if (!user) {
        error("Please login to add items to wishlist");
        return;
      }

      if (wishlistLoading) return;

      setWishlistLoading(true);
      try {
        if (isInWishlist) {
          await removeFromWishlist(productId);
          setIsInWishlist(false);
          success("Removed from wishlist");
        } else {
          await addToWishlist(productId);
          setIsInWishlist(true);
          success("Added to wishlist");
        }
      } catch (err: any) {
        // Silently handle 401 errors (user not logged in) - already shown error message above
        if (err?.response?.status !== 401) {
          error(err.message || "Failed to update wishlist");
        }
      } finally {
        setWishlistLoading(false);
      }
    };

    // Show button for all users - will prompt login if not authenticated

    return (
      <button
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className="flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: "var(--theme-primary)",
          color: "var(--theme-primary)",
          backgroundColor: isInWishlist ? "var(--theme-light)" : "transparent",
        }}
        onMouseEnter={(e) => {
          if (!wishlistLoading) {
            e.currentTarget.style.backgroundColor = "var(--theme-light)";
          }
        }}
        onMouseLeave={(e) => {
          if (!wishlistLoading) {
            e.currentTarget.style.backgroundColor = isInWishlist ? "var(--theme-light)" : "transparent";
          }
        }}
      >
        {wishlistLoading ? (
          <CircularLoader 
            size={18} 
            color="var(--theme-primary)"
          />
        ) : (
          <Heart 
            size={20} 
            className={isInWishlist ? 'fill-current' : ''}
            style={{ 
              color: "var(--theme-primary)",
              fill: isInWishlist ? "var(--theme-primary)" : "transparent"
            }}
          />
        )}
      </button>
    );
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={product?.name || ""} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImageUrl} />
        <meta property="og:image:secure_url" content={metaImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={product?.name || ""} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content={companyName} />
        <meta property="product:price:amount" content={product?.price?.toString() || ""} />
        <meta property="product:price:currency" content="PKR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product?.name || ""} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImageUrl} />
        <meta name="twitter:image:alt" content={product?.name || ""} />
        {/* Additional meta tags for better compatibility */}
        <meta name="og:image" content={metaImageUrl} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Navbar />

      <div className="min-h-screen" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 mb-0">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {/* Product Section - Give more space to detail part (1:1.5 ratio) */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-2 md:gap-3 mb-8 md:mb-12">
            {/* Image Gallery - Aligned left with space */}
            <div className="w-full flex justify-start -mr-2 md:-mr-3">
              <ProductImageGallery images={product.images || ["/product.png"]} />
            </div>

            {/* Product Info - Takes more space, fills the gap */}
            <div className="flex flex-col gap-3">
              <span 
                className="text-xs px-3 py-1 rounded-full w-fit text-white font-medium"
                style={{
                  backgroundColor: "var(--theme-primary)",
                  color: "white",
                }}
              >
                {product.categoryName || product.category?.name || (typeof product.category === 'string' ? product.category : 'Category')}
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold theme-heading" style={{ color: "var(--theme-primary)" }}>{product.name || "Product Name"}</h1>

              <div className="flex gap-3 items-center flex-wrap">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {discountedPrice} Rs
                </span>
                {product.discount && (
                  <span className="line-through text-gray-400 text-lg sm:text-xl">
                    {product.price} Rs
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm sm:text-base">
                {product.description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <AddToCartButton
                  product={{
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    discount: product.discount,
                    image: product.images?.[0],
                  }}
                />
                <WishlistButtonComponent productId={product._id} />
              </div>

              {/* Social Share */}
              <SocialShare
                productName={product.name}
                productUrl={window.location.href}
                productImage={companyLogoUrl || heroBannerImage || product.images?.[0]}
                productDescription={product.description}
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description">
            <TabsList 
              className="bg-gray-100 p-1 rounded-lg h-auto"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <TabsTrigger 
                value="description"
                className="px-4 py-2 rounded-md transition-all"
              >
                Description
              </TabsTrigger>
              {(() => {
                // Only show video tab if video exists and is not empty
                const hasVideo = product.video1 && 
                  product.video1.trim() !== "" && 
                  product.video1.trim().length > 0;
                
                if (!hasVideo) return null;
                
                return (
                  <TabsTrigger 
                    value="videos"
                    className="px-4 py-2 rounded-md transition-all"
                  >
                    Demo Video
                  </TabsTrigger>
                );
              })()}
            </TabsList>

            <TabsContent value="description" className="bg-transparent mt-4">
              {(() => {
                // Check if content exists and is not just empty HTML
                const hasMetaFeatures = product.metaFeatures && 
                  product.metaFeatures.trim() !== "" && 
                  product.metaFeatures.replace(/<[^>]*>/g, '').trim() !== "";
                const hasMetaInfo = product.metaInfo && 
                  product.metaInfo.trim() !== "" && 
                  product.metaInfo.replace(/<[^>]*>/g, '').trim() !== "";
                
                if (hasMetaFeatures || hasMetaInfo) {
                  return (
                    <div 
                      className="grid md:grid-cols-2 gap-6 rounded-xl p-6"
                      style={{ 
                        backgroundColor: "#FDFBF8",
                        border: "1px solid #E5E5E5"
                      }}
                    >
                      {hasMetaFeatures && (
                        <div className="bg-transparent meta-features-container">
                          <h3 className="text-2xl font-bold mb-6 theme-heading" style={{ color: "var(--theme-primary)" }}>Meta Features</h3>
                          <div
                            className="max-w-none meta-info-content text-black"
                            dangerouslySetInnerHTML={{
                              __html: cleanHtmlContent(product.metaFeatures),
                            }}
                          />
                        </div>
                      )}

                      {hasMetaInfo && (
                        <div className="bg-transparent meta-features-container">
                          <h3 className="text-2xl font-bold mb-6 theme-heading" style={{ color: "var(--theme-primary)" }}>Meta Info</h3>
                          <div
                            className="max-w-none meta-info-content text-black"
                            dangerouslySetInnerHTML={{
                              __html: cleanHtmlContent(product.metaInfo),
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
            </TabsContent>

            {(() => {
              // Check if video exists and is not empty
              const hasVideo = product.video1 && 
                product.video1.trim() !== "" && 
                product.video1.trim().length > 0;
              
              if (!hasVideo) return null;
              
              return (
                <TabsContent value="videos" className="bg-transparent mt-4">
                  <div 
                    className="rounded-xl p-6"
                    style={{ 
                      backgroundColor: "#FDFBF8",
                      border: "1px solid #E5E5E5"
                    }}
                  >
                    <iframe
                      className="w-full h-80 rounded-lg"
                      src={product.video1?.replace(
                        "watch?v=",
                        "embed/"
                      ) || ""}
                      allowFullScreen
                    />
                  </div>
                </TabsContent>
              );
            })()}
          </Tabs>

          {/* Services */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 my-6 md:my-12">
            {[Flag, RotateCcw, Headphones, Truck].map(
              (Icon, i) => (
                <div
                  key={i}
                  className="p-3 md:p-6 text-center"
                >
                  <Icon className="mx-auto mb-2 w-6 h-6 md:w-8 md:h-8" style={{ color: "var(--theme-primary)" }} />
                  <p className="font-semibold text-sm md:text-base text-gray-900">
                    {["Locally Owned", "Easy Return", "24/7 Support", "Fast Delivery"][i]}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Similar Products */}
          <h3 className="text-2xl font-bold mb-3 md:mb-6 theme-heading" style={{ color: "var(--theme-primary)" }}>
            Similar Products
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {similarProducts.map((p) => (
              <ProductCard
                key={p._id}
                id={p._id}
                name={p.name}
                price={p.price}
                image={p.images?.[0] || "/product.png"}
                offer={p.discount ? `${p.discount}% OFF` : undefined}
              />
            ))}
          </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
