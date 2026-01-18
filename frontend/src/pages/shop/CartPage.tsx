import React, { useState, useEffect } from "react";
import TwoColumnLayout from "@/components/ui/TwoColumnLayout";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CheckoutModal from "@/components/ui/modals/CheckoutModal";
import { Trash2 } from "lucide-react";
import { useCart } from "@/components/products/CartContext";
import Banner from "@/components/hero/Banner";
import { getBanners, type Banner as BannerType } from "@/api/banner.api";


const CartPage = () => {
    const [openCheckout, setOpenCheckout] = useState(false);
    const [shopBanner, setShopBanner] = useState<BannerType | null>(null);
const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  // Load shop banner
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getBanners();
        const banner = data.find((b) => b.slot === "shop-main");
        setShopBanner(banner || null);
      } catch (err) {
        console.error("Failed to load banner for Cart page", err);
      }
    };
    fetchBanner();
  }, []);
const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

// Calculate subtotal from original prices (item.price is original price)
const subtotal = cartItems.reduce((sum, item) => {
  const itemPrice = Number(item.price) || 0;
  return sum + (itemPrice * item.quantity);
}, 0);

// Calculate total discount amount
const discount = cartItems.reduce((sum, item) => {
  const itemPrice = Number(item.price) || 0;
  const itemDiscount = Number(item.discount) || 0;
  if (itemDiscount === 0) return sum;
  const itemSubtotal = itemPrice * item.quantity;
  return sum + ((itemDiscount / 100) * itemSubtotal);
}, 0);

const total = subtotal - discount;



  const leftContent = (
    <div className="space-y-4">
  {cartItems.map((item) => {
    // item.price is the original price, item.discount is the discount percentage
    const itemPrice = Number(item.price) || 0;
    const itemDiscount = Number(item.discount) || 0;
    const itemSubtotal = itemPrice * item.quantity;
    const itemDiscountAmount = itemDiscount > 0 
      ? (itemDiscount / 100) * itemSubtotal 
      : 0;
    const itemFinalPrice = itemPrice - (itemDiscount > 0 ? (itemDiscount / 100) * itemPrice : 0);
    const itemTotal = itemSubtotal - itemDiscountAmount;
    
    return (
    <div key={item.id} className="flex items-center justify-between p-5 bg-white text-black rounded-xl shadow-sm border">
      <div className="flex items-center gap-4 flex-1">
        <img src={item.image || "/product.png"} className="w-20 h-20 object-cover rounded-lg" />
        <div className="flex-1">
          <h3 className="font-semibold theme-heading">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {itemDiscount > 0 ? (
              <>
                <span className="text-sm text-gray-500 line-through">${itemPrice.toFixed(2)}</span>
                <span className="text-lg font-bold">${itemFinalPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold">${itemPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => decreaseQuantity(item.id)} className="text-black w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition">−</button>
        <span className="text-black text-lg w-8 text-center">{item.quantity}</span>
        <button onClick={() => increaseQuantity(item.id)} className="text-black w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition">+</button>
      </div>

      <button onClick={() => removeFromCart(item.id)} className="ml-4 p-1 text-red-500 hover:bg-red-100 rounded-full transition">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )})}
</div>
  );

const rightContent = (
  <div className="p-6 bg-white text-black rounded-xl shadow-sm border">
    <h2 className="font-semibold mb-4 text-lg theme-heading">Order Summary</h2>

    <div className="space-y-3 text-gray-700 text-sm">
      <div className="flex justify-between">
        <span>Items</span>
        <span className="font-medium">{totalItems}</span>
      </div>

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span className="font-medium">-${discount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
        <span className="text-gray-900">Total</span>
        <span className="text-gray-900">${total.toFixed(2)}</span>
      </div>
    </div>

    <button
      onClick={() => setOpenCheckout(true)}
      className="mt-6 w-full text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2"
      style={{
        backgroundColor: "var(--theme-primary)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--theme-dark)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--theme-primary)";
      }}
    >
      Go to Checkout →
    </button>
  </div>
);


  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-white max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* ⭐ Main Page Heading (Aligns both sections perfectly) */}
        <h2 className="text-2xl font-bold mb-6 theme-heading">Purchase List</h2>

        <TwoColumnLayout left={leftContent} right={rightContent} />
        <CheckoutModal isOpen={openCheckout} onClose={() => setOpenCheckout(false)} />

        {/* Shop Banner after Purchase List and Order Summary */}
        {shopBanner && (
          <div className="mt-4 md:mt-8">
            <Banner imageSrc={shopBanner.imageUrl} />
          </div>
        )}

      </div>

      <div className="mt-4 md:mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default CartPage;
