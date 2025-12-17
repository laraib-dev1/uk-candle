import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import AddToCartButton from "@/components/ui/buttons/AddToCartButton";
import SocialShare from "@/components/products/SocialShare";
import ProductCard from "@/components/products/ProductCard";
import { getProduct, getProducts } from "@/api/product.api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Helmet } from "react-helmet";
import { Flag, RotateCcw, Headphones, Truck, ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  images?: string[];
  category?: string;
  categoryName?: string;
  metaFeatures?: string;  // HTML content
  metaInfo?: string;      // HTML content
  video1?: string;        // YouTube URL
  video2?: string;        // YouTube URL (optional)
  stock?: number;
  [key: string]: any; 
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);


  // Fetch single product
   useEffect(() => {
  if (!id) return;
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProduct(id);  
      console.log("GET PRODUCT RESPONSE:", res);

      const productData = res;  // ← FIXED

      const images = [
        productData.image1,
        productData.image2,
        productData.image3,
        productData.image4,
        productData.image5,
        productData.image6
      ].filter(Boolean);

      // Extract category name - Backend should return categoryName directly
      // The backend controller returns categoryName in the response
      const categoryName = productData.categoryName 
        || (typeof productData.category === 'object' && productData.category?.name)
        || productData.category
        || 'Category';

      console.log("=== PRODUCT DATA DEBUG ===");
      console.log("Full product response:", productData);
      console.log("Category fields:", { 
        categoryName: productData.categoryName, 
        category: productData.category,
        categoryId: productData.categoryId,
        categoryNameType: typeof productData.categoryName,
        categoryType: typeof productData.category,
        allKeys: Object.keys(productData).filter(k => k.toLowerCase().includes('categ'))
      });
      console.log("Final categoryName:", categoryName);

      // Ensure categoryName is explicitly set in product state
      const finalProduct = { 
        ...productData, 
        images, 
        categoryName: categoryName 
      };
      
      console.log("Setting product with categoryName:", finalProduct.categoryName);
      setProduct(finalProduct);

    } catch (err) {
      console.error("PRODUCT FETCH ERROR =>", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);


  // Fetch all products for similar products
useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getProducts(); // returns { success, data }
const mapped = res.data.map((p: any) => ({
          ...p,
          id: p._id,
          categoryId: p.category?._id,
          categoryName: p.category?.name,
        }));
        setAllProducts(mapped);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  if (!product) return <div>Loading...</div>;

  // similar products
  const similar = allProducts.filter((p) => p._id !== product._id).slice(0, 4);

  // Calculate discounted price
  const discountedPrice = product.discount 
    ? Math.round(product.price - (product.price * product.discount / 100))
    : product.price;

  // Extract attributes from metaFeatures (if available)
  const attributes = product.metaFeatures 
    ? product.metaFeatures.match(/<li>(.*?)<\/li>/g)?.map(li => li.replace(/<\/?li>/g, '')) || []
    : ['EAN', 'Color', 'Attribute 3', 'Attribute 4', 'Attribute 5', 'Attribute 6'];

  return (
    <>
      <Helmet>
        <title>{product.name} | My Shop</title>
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description || ""} />
        <meta property="og:image" content={product.images?.[0] || "/product.png"} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
      </Helmet>
      <Navbar />
      <div className="bg-white min-h-screen">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          {/* Main Product Section */}
          <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 md:gap-6 mb-12">
            {/* Left: Product Image Gallery - Fixed width, constrained */}
            <div className="w-full max-w-[400px]">
              <ProductImageGallery images={product.images || ["/product.png"]} />
            </div>

            {/* Right: Product Details - Takes all remaining space */}
            <div className="flex flex-col gap-6 w-full">
              {/* Category Badge - Always show, force display */}
              {(() => {
                const catName = product.categoryName 
                  || (typeof product.category === 'object' && product.category?.name) 
                  || (typeof product.category === 'string' && product.category)
                  || "Category";
                console.log("Rendering category:", catName, "from product:", product);
                return (
                  <span className="inline-block bg-[#A8734B]/20 text-[#A8734B] text-xs font-semibold px-3 py-1 rounded-full w-fit">
                    {catName}
                  </span>
                );
              })()}

              {/* Product Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Price Display */}
              <div className="flex items-baseline gap-3">
                {product.discount ? (
                  <>
                    <span className="text-2xl font-bold text-gray-900">
                      {discountedPrice} Rs
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price} Rs
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || "Ecommerce, also known as electronic commerce or internet commerce, refers to the buying and selling of goods or services using the internet, and the transfer of money and data to execute these transactions."}
              </p>

              {/* Add to Purchase Button */}
              <div className="mt-4">
                <AddToCartButton
                  product={{
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    discount: product.discount,
                    image: product.images?.[0],
                  }}
                />
              </div>

              {/* Social Share */}
              <div className="mt-6">
                <SocialShare
                  productName={product.name}
                  productUrl={window.location.href}
                  productImage={product.images?.[0]}
                  productDescription={product.description}
                />
              </div>
            </div>
          </div>
          {/* Description + Videos Section with Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
            <Tabs defaultValue="description" className="w-full">
              {/* Tabs Header */}
              <TabsList className="bg-transparent border-b border-gray-200 p-0 mb-6 h-auto">
                <TabsTrigger 
                  value="description" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 data-[state=active]:text-[#A8734B] data-[state=active]:border-b-2 data-[state=active]:border-[#A8734B] rounded-none"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="videos"
                  className="px-4 py-2 text-sm font-medium text-gray-700 data-[state=active]:text-[#A8734B] data-[state=active]:border-b-2 data-[state=active]:border-[#A8734B] rounded-none"
                >
                  Demo Video
                </TabsTrigger>
              </TabsList>

              {/* Description Tab Content */}
              <TabsContent value="description" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Meta Features (from admin metaFeatures field) */}
                  <div>
                    <div
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: product.metaFeatures || "<p>No features available.</p>" 
                      }}
                    />
                  </div>

                  {/* Right: Meta Info (from admin metaInfo field) */}
                  <div>
                    <div
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: product.metaInfo || product.description || "<p>Ecommerce, also known as electronic commerce or internet commerce, refers to the buying and selling of goods or services using the internet, and the transfer of money and data to execute these transactions.</p>" 
                      }}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Demo Video Tab Content */}
              <TabsContent value="videos" className="mt-6">
                {product.video1 ? (
                  <div className="mb-6">
                    <iframe
                      className="w-full h-64 md:h-96 rounded-lg"
                      src={product.video1.replace("watch?v=", "embed/")}
                      allowFullScreen
                      title="Demo Video 1"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500">No demo video available.</p>
                )}

                {product.video2 && (
                  <div>
                    <iframe
                      className="w-full h-64 md:h-96 rounded-lg"
                      src={product.video2.replace("watch?v=", "embed/")}
                      allowFullScreen
                      title="Demo Video 2"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Service Highlights Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Locally Owned */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
              <div className="bg-[#A8734B]/10 rounded-full p-4 mb-4">
                <Flag className="w-6 h-6 text-[#A8734B]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Locally Owned</h3>
              <p className="text-xs text-gray-600">
                We have local business and sell best quality clothes
              </p>
            </div>

            {/* Easy Return */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
              <div className="bg-[#A8734B]/10 rounded-full p-4 mb-4">
                <RotateCcw className="w-6 h-6 text-[#A8734B]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Return</h3>
              <p className="text-xs text-gray-600">
                We provide easy return policy.
              </p>
            </div>

            {/* Online Support */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
              <div className="bg-[#A8734B]/10 rounded-full p-4 mb-4">
                <Headphones className="w-6 h-6 text-[#A8734B]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Online Support</h3>
              <p className="text-xs text-gray-600">
                We give 24/7 online support
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
              <div className="bg-[#A8734B]/10 rounded-full p-4 mb-4">
                <Truck className="w-6 h-6 text-[#A8734B]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-xs text-gray-600">
                We provide fast delivery to our customers
              </p>
            </div>
          </div>

          {/* Similar Products Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Similar More</h3>
              <div className="flex items-center gap-2">
                <button 
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-[#A8734B] hover:border-[#A8734B] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  className="w-8 h-8 rounded-full border border-[#A8734B] flex items-center justify-center text-[#A8734B] hover:bg-[#A8734B] hover:text-white transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {similar.map((p) => {
                const discountedPrice = p.discount 
                  ? Math.round(p.price - (p.price * p.discount / 100))
                  : p.price;
                return (
                  <ProductCard
                    key={p._id}
                    id={p._id}
                    name={p.name}
                    price={`Rs: ${discountedPrice}`}
                    image={p.images?.[0] ?? "/product.png"}
                    offer={p.discount ? `${p.discount}% OFF` : undefined}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
