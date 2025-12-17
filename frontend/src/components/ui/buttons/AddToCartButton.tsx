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
      className={`w-full md:w-auto px-8 bg-[#A8734B] hover:bg-[#8d5f3a] text-white font-semibold py-3 rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
        loading ? "opacity-70 cursor-not-allowed" : ""
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
