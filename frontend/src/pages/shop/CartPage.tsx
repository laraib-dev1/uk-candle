import React, { useState } from "react";
import TwoColumnLayout from "@/components/ui/TwoColumnLayout";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CheckoutModal from "@/components/ui/modals/CheckoutModal";
import { Trash2 } from "lucide-react";
import { useCart } from "@/components/products/CartContext";


const CartPage = () => {
    const [openCheckout, setOpenCheckout] = useState(false);
    const [buttonLoaders, setButtonLoaders] = useState<Record<string, boolean>>({});
    const [checkoutLoading, setCheckoutLoading] = useState(false);
const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
const discount = cartItems.reduce((sum, item) => sum + ((Number(item.discount) || 0) / 100) * Number(item.price) * item.quantity, 0);
const total = subtotal - discount;



  const leftContent = (
    <div className="space-y-4">
  {cartItems.map((item) => (
    <div key={item.id} className="flex items-center justify-between p-5 bg-white text-black not-first:rounded-xl shadow-sm border">
      <div className="flex items-center gap-4">
        <img src={item.image || "/product.png"} className="w-20 h-20 object-cover rounded-lg" />
        <div>
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
          <p className="text-lg font-bold">${item.price}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            const key = `dec-${item.id}`;
            if (buttonLoaders[key]) return;
            setButtonLoaders(prev => ({ ...prev, [key]: true }));
            decreaseQuantity(item.id);
            setTimeout(() => setButtonLoaders(prev => ({ ...prev, [key]: false })), 300);
          }} 
          disabled={buttonLoaders[`dec-${item.id}`]}
          className="text-black w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonLoaders[`dec-${item.id}`] ? (
            <span className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            "−"
          )}
        </button>
        <span className="text-black text-lg">{item.quantity}</span>
        <button 
          onClick={() => {
            const key = `inc-${item.id}`;
            if (buttonLoaders[key]) return;
            setButtonLoaders(prev => ({ ...prev, [key]: true }));
            increaseQuantity(item.id);
            setTimeout(() => setButtonLoaders(prev => ({ ...prev, [key]: false })), 300);
          }} 
          disabled={buttonLoaders[`inc-${item.id}`]}
          className="text-black w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonLoaders[`inc-${item.id}`] ? (
            <span className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            "+"
          )}
        </button>
      </div>

      <button 
        onClick={() => {
          const key = `remove-${item.id}`;
          if (buttonLoaders[key]) return;
          setButtonLoaders(prev => ({ ...prev, [key]: true }));
          removeFromCart(item.id);
          setTimeout(() => setButtonLoaders(prev => ({ ...prev, [key]: false })), 300);
        }} 
        disabled={buttonLoaders[`remove-${item.id}`]}
        className="ml-4 p-1 text-red-500 hover:bg-red-100 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {buttonLoaders[`remove-${item.id}`] ? (
          <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Trash2 className="w-5 h-5" />
        )}
      </button>
    </div>
  ))}
</div>
  );

const rightContent = (
  <div className="p-6 bg-white text-black rounded-xl shadow-sm border">
    <h2 className="font-semibold mb-4 text-lg">Order Summary</h2>

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

      <div 
        className="flex justify-between font-bold text-lg"
        style={{ color: "var(--theme-primary)" }}
      >
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>

    <button
      onClick={async () => {
        if (checkoutLoading) return;
        setCheckoutLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          setOpenCheckout(true);
        } finally {
          setCheckoutLoading(false);
        }
      }}
      disabled={checkoutLoading}
      className="mt-6 w-full text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2 theme-button disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {checkoutLoading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
      Go to Checkout →
    </button>
  </div>
);


  return (
    <>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />

        <main className="flex-1 py-20">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
            {/* ⭐ Main Page Heading (Aligns both sections perfectly) */}
            <h2 className="text-3xl font-semibold mb-10">Purchase List</h2>

            <TwoColumnLayout left={leftContent} right={rightContent} />
            <CheckoutModal isOpen={openCheckout} onClose={() => setOpenCheckout(false)} />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CartPage;
