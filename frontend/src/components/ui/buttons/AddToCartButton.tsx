import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/components/products/CartContext";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    discount?: number; 
    image?: string;
  };
};

export default function AddToCartButton({ product }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    addToCart({ ...product, quantity: 1 });

    await new Promise((res) => setTimeout(res, 500));

    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-50 bg-amber-600 text-white font-semibold py-3 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
        loading ? "opacity-70 cursor-not-allowed" : "hover:bg-amber-700"
      }`}
    >
      {loading ? (
        <>
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Processing...
        </>
      ) : (
        "Add to Purchase"
      )}
    </button>
  );
}
