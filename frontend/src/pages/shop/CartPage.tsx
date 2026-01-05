import React, { useState } from "react";
import TwoColumnLayout from "@/components/ui/TwoColumnLayout";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CheckoutModal from "@/components/ui/modals/CheckoutModal";
import { Trash2 } from "lucide-react";
import { useCart } from "@/components/products/CartContext";


const CartPage = () => {
    const [openCheckout, setOpenCheckout] = useState(false);
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
          <h3 className="font-semibold theme-heading">{item.name}</h3>
          <p className="text-lg font-bold">${item.price}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => decreaseQuantity(item.id)} className="text-black w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">−</button>
        <span className="text-black text-lg">{item.quantity}</span>
        <button onClick={() => increaseQuantity(item.id)} className="text-black w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">+</button>
      </div>

      <button onClick={() => removeFromCart(item.id)} className="ml-4 p-1 text-red-500 hover:bg-red-100 rounded-full transition">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  ))}
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

      <div className="flex justify-between text-amber-700 font-bold text-lg">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>

    <button
      onClick={() => setOpenCheckout(true)}
      className="mt-6 w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition-all flex items-center justify-center gap-2"
    >
      Go to Checkout →
    </button>
  </div>
);


  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-white max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-0">

        {/* ⭐ Main Page Heading (Aligns both sections perfectly) */}
        <h2 className="text-3xl font-semibold mb-10 theme-heading">Purchase List</h2>

        <TwoColumnLayout left={leftContent} right={rightContent} />
        <CheckoutModal isOpen={openCheckout} onClose={() => setOpenCheckout(false)} />

      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
