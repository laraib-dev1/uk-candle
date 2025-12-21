import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
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
  const [loading, setLoading] = useState(false);

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
        const res = await getProducts();
        const mapped = res.data.map((p: any) => ({
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

  if (loading || !product) {
    return <div className="p-10 text-center">Loading...</div>;
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
     JSX
  ======================= */
  return (
    <>
      <Helmet>
        <title>{product.name} | My Shop</title>
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description || ""} />
        <meta
          property="og:image"
          content={product.images?.[0] || "/product.png"}
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
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

              <h1 className="text-3xl font-bold">{product.name}</h1>

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
                  <h3 className="text-lg font-semibold mb-3 text-black">Meta Features</h3>
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
                  <h3 className="text-lg font-semibold mb-3 text-black">Meta Info</h3>
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
          <h3 className="text-xl font-semibold mb-4">
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
