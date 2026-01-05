import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Flag,
  RotateCcw,
  Headphones,
  Truck,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import AddToCartButton from "@/components/ui/buttons/AddToCartButton";
import SocialShare from "@/components/products/SocialShare";
import ProductCard from "@/components/products/ProductCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getProduct, getProducts } from "@/api/product.api";
import { getCompany } from "@/api/company.api";
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

  /* =======================
     Fetch Single Product
  ======================= */
  useEffect(() => {
    if (!id) return;

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
        ].filter(Boolean);

        setProduct({
          ...data,
          images,
          categoryName:
            data.categoryName ||
            data.category?.name ||
            "Category",
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
     Fetch Company Name
  ======================= */
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompany();
        if (data?.company) {
          setCompanyName(data.company);
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
        
        // Remove backgrounds and set text color to black in meta features container
        if (metaFeaturesContainer) {
          const allElements = metaFeaturesContainer.querySelectorAll('*');
          allElements.forEach((el) => {
            (el as HTMLElement).style.backgroundColor = 'transparent';
            (el as HTMLElement).style.background = 'transparent';
            (el as HTMLElement).style.backgroundImage = 'none';
            (el as HTMLElement).style.color = 'black';
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

    const ogImageUrl = getAbsoluteImageUrl(product.images?.[0]);
    const ogDescription = cleanDescription(product.description, product.name);
    const pageTitle = `${product.name} | ${companyName}`;

    console.log("🔍 Product Meta Tags Debug:", {
      productName: product.name,
      productDescription: product.description,
      cleanedDescription: ogDescription,
      productImages: product.images,
      firstImage: product.images?.[0],
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
  }, [product, companyName]);

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

  // No need to parse - display as HTML like metaInfo

  // Clean HTML content to remove broken images and backgrounds
  const cleanHtmlContent = (html: string) => {
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

  /* =======================
     JSX - Calculate meta tag values
  ======================= */
  const ogImageUrl = getAbsoluteImageUrl(product.images?.[0]);
  const ogDescription = cleanDescription(product.description, product.name);
  const pageTitle = `${product.name} | ${companyName}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={product.name} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content={companyName} />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="PKR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={product.name} />
        {/* Additional meta tags for better compatibility */}
        <meta name="og:image" content={ogImageUrl} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Navbar />

      <div className="bg-white text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Product Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <ProductImageGallery images={product.images || ["/product.png"]} />

            <div className="flex flex-col gap-6">
              <span 
                className="text-xs px-3 py-1 rounded-full w-fit"
                style={{
                  backgroundColor: "var(--theme-light)",
                  color: "var(--theme-primary)",
                }}
              >
                {product.categoryName}
              </span>

              <h1 className="text-3xl font-bold theme-heading">{product.name}</h1>

              <div className="flex gap-3 items-center">
                <span className="text-2xl font-bold">
                  {discountedPrice} Rs
                </span>
                {product.discount && (
                  <span className="line-through text-gray-400">
                    {product.price} Rs
                  </span>
                )}
              </div>

              <p className="text-gray-600">
                {product.description}
              </p>

              <AddToCartButton
                product={{
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  discount: product.discount,
                  image: product.images?.[0],
                }}
              />

              <SocialShare
                productName={product.name}
                productUrl={window.location.href}
                productImage={product.images?.[0]}
                productDescription={product.description}
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description">
            <TabsList className="text-black">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="videos">Demo Video</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="bg-transparent">
              <div className="grid md:grid-cols-2 gap-6 bg-transparent">
                <div className="bg-transparent meta-features-container">
                  <h3 className="text-lg font-semibold mb-3 theme-heading">Meta Features</h3>
                  {product.metaFeatures ? (
                    <div
                      className="max-w-none meta-info-content text-black"
                      dangerouslySetInnerHTML={{
                        __html: cleanHtmlContent(product.metaFeatures),
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm bg-transparent">No features listed</p>
                  )}
                </div>

                <div className="bg-transparent meta-features-container">
                  <h3 className="text-lg font-semibold mb-3 theme-heading">Meta Info</h3>
                  {product.metaInfo ? (
                    <div
                      className="max-w-none meta-info-content text-black"
                      dangerouslySetInnerHTML={{
                        __html: cleanHtmlContent(product.metaInfo),
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm bg-transparent">No additional information available</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="bg-transparent">
              {product.video1 ? (
                <iframe
                  className="w-full h-80"
                  src={product.video1.replace(
                    "watch?v=",
                    "embed/"
                  )}
                  allowFullScreen
                />
              ) : (
                <p>No video available</p>
              )}
            </TabsContent>
          </Tabs>

          {/* Services */}
          <div className="grid md:grid-cols-4 gap-6 my-12">
            {[Flag, RotateCcw, Headphones, Truck].map(
              (Icon, i) => (
                <div
                  key={i}
                  className=" p-6 text-center"
                >
                  <Icon className="mx-auto mb-2 theme-text-primary" />
                  <p className="font-semibold">
                    {["Locally Owned", "Easy Return", "24/7 Support", "Fast Delivery"][i]}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Similar Products */}
          <h3 className="text-xl font-semibold mb-4 theme-heading">
            Similar Products
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
    </>
  );
}
