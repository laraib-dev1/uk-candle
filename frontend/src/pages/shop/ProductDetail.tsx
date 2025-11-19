import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductInfo from "@/components/products/ProductInfo";
import AddToCartButton from "@/components/ui/buttons/AddToCartButton";
import SocialShare from "@/components/products/SocialShare";
import ProductCard from "@/components/products/ProductCard";

// Dummy data (replace with real data or import from shared file)
const products = [
  {
    id: 1,
    title: "Product Title We took the next level",
    price: 100,
    images: ["/product.png", "/product.png", "/product.png", "/product.png"],
    offer: "10% OFF",
    description:
      "Ecommerce, also known as electronic commerce or internet commerce, refers to the buying and selling of goods or services using the internet...Ecommerce, also known as electronic commerce or internet commerce, refers to the buying and selling of goods or services using the internet..Ecommerce, also known as electronic commerce or internet commerce, refers to the buying and selling of goods or services using the internet....Ecommerce, also known as electronic commerce or internet commerce, refers to the buying and selling of goods or services using the internet...Ecommerce, also known as electronic commerce or internet commerce, refers to the buying and selling of goods or services using the internet...",
  },
  {
    id: 2,
    title: "Eucalyptus Oil",
    price: 4.99,
    images: ["/product.png"],
    offer: "10% OFF",
    description: "Short description for eucalyptus oil...",
  },
  {
    id: 3,
    title: "Rapeseed Candle",
    price: 22.5,
    images: ["/product.png"],
    description: "This is a Rapeseed Candle product description...",
  },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id.toString() === id) || products[0];
  const similar = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
    <Navbar/>
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      {/* <Link to="/shop" className="text-gray-600 hover:text-gray-900 underline mb-6 inline-block">
        ← Back to Products
      </Link> */}

      {/* ===== grouped main container: images + details ===== */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* gallery (left) */}
          <div className="md:col-span-5">
            <ProductImageGallery images={product.images} />
          </div>

       {/* details (right) */}
<div className="md:col-span-7 flex flex-col h-full">

  {/* TOP SECTION */}
  <div className="flex flex-col gap-4 md:flex-grow">

    <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded">
      Category
    </span>

    <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
      {product.title}
    </h1>

    {/* price */}
    <div className="flex items-center gap-4">
      <div className="flex items-baseline gap-3">
        <span className="text-gray-400 line-through text-sm">100</span>
        <span className="text-2xl font-bold text-amber-700">
          Rs {product.price}
        </span>
      </div>

      {product.offer && (
        <span className="ml-2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
          {product.offer}
        </span>
      )}
    </div>

    {/* description */}
    <p className="text-sm text-slate-500 leading-relaxed">
      {product.description}
    </p>
  </div>

  {/* BOTTOM SECTION — only fixed on md+ */}
  <div className="mt-6 md:mt-auto md:pt-4">

    <AddToCartButton />

    <div className="mt-4">
      <SocialShare />
    </div>

  </div>

</div>


        </div>
      </div>

      {/* ===== Tabs / Description / Demo section (full-width under the main box) ===== */}
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow p-6">
          {/* tabs header */}
          <div className="border-b -mx-6 px-6 pb-3">
            <nav className="flex gap-4 text-sm">
              <button className="pb-2 border-b-2 border-amber-300 text-amber-700 font-medium">Description</button>
              <button className="pb-2 text-slate-500">Demo Video</button>
            </nav>
          </div>

          {/* tab content */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2 text-sm text-slate-600">
              <p className="mb-3">{product.description}</p>
              <p className="text-sm text-slate-500">More details about product attributes, usage, and care.</p>
            </div>

            <div className="bg-amber-50 p-4 rounded">
              <ul className="text-sm text-slate-700 space-y-2">
                <li>• Brand: Example</li>
                <li>• Color: Natural</li>
                <li>• Size: 250ml</li>
                <li>• Material: Natural wax</li>
                <li>• EAN: 123456789</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Info boxes ===== */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow p-4 text-center">
          <div className="text-2xl mb-2">🏬</div>
          <div className="font-semibold">Locally Owned</div>
          <div className="text-xs text-slate-500">We have local business and sell best quality clothes</div>
        </div>
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow p-4 text-center">
          <div className="text-2xl mb-2">🔁</div>
          <div className="font-semibold">Easy Return</div>
          <div className="text-xs text-slate-500">We provide easy return policy</div>
        </div>
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow p-4 text-center">
          <div className="text-2xl mb-2">💬</div>
          <div className="font-semibold">Online Support</div>
          <div className="text-xs text-slate-500">We give 24/7 online support</div>
        </div>
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow p-4 text-center">
          <div className="text-2xl mb-2">🚚</div>
          <div className="font-semibold">Fast Delivery</div>
          <div className="text-xs text-slate-500">We provide fast delivery to our customers</div>
        </div>
      </div>

      {/* ===== Similar products ===== */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Similar More</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {similar.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title={p.title}
              price={p.price}
              image={p.images?.[0] ?? "/product.png"}
              offer={p.offer}
            />
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
    
  );
}
