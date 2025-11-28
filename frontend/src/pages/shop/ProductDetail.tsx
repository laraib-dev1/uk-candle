import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import AddToCartButton from "@/components/ui/buttons/AddToCartButton";
import SocialShare from "@/components/products/SocialShare";
import ProductCard from "@/components/products/ProductCard";
import { getProduct, getProducts } from "@/api/product.api";

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  images?: string[];
  category?: string;
  categoryName?: string;
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
        setProduct(res.data); // backend now returns both categoryId & categoryName
      } catch (err) {
        console.error(err);
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
        const res = await getProducts();
        const mapped = res.map((p: any) => ({
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

  return (
    <>
      <Navbar />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* gallery */}
            <div className="md:col-span-5">
              <ProductImageGallery images={product.images || ["/product.png"]} />
            </div>

            {/* details */}
            <div className="md:col-span-7 flex flex-col h-full">
              <div className="flex flex-col gap-4 md:grow">
                <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded">
                  {product.categoryName || "Category"}
                </span>

                <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
                  {product.name}
                </h1>

                {/* price */}
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline gap-3">
                    {product.discount && (
                      <span className="text-gray-400 line-through text-sm">
                        Rs {product.price}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-amber-700">
                      Rs {product.price - (product.discount || 0)}
                    </span>
                  </div>

                  {product.discount && (
                    <span className="ml-2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* description */}
                <p className="text-sm text-slate-500 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Add to cart + share */}
              <div className="mt-6 md:mt-auto md:pt-4">
                <AddToCartButton
  product={{
    id: product._id,               // map _id → id
    name: product.name,
    price: product.price - (product.discount || 0),
    image: product.images?.[0],
  }}
/>

                <div className="mt-4">
                  <SocialShare />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar products */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Similar More</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {similar.map((p) => (
              <ProductCard
                key={p._id}
                id={p._id}
                name={p.name}
                price={p.price - (p.discount || 0)}
                image={p.images?.[0] ?? "/product.png"}
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
