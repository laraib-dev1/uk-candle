import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { addToWishlist, removeFromWishlist } from "@/api/user.api";
import { useToast } from "@/components/ui/toast";

type Props = {
  id: string | number;
  name: string;
  price: number | string;
  image?: string;
  offer?: string;
  isInWishlist?: boolean;
};

export default function ProductCard({ id, name, price, image, offer, isInWishlist: initialIsInWishlist }: Props) {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist || false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Calculate prices
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
  const discountPercent = offer ? parseFloat(offer) : 0;
  
  // If discount exists, calculate original price
  const originalPrice = discountPercent > 0 
    ? numericPrice / (1 - discountPercent / 100)
    : numericPrice;
  const discountedPrice = discountPercent > 0 ? numericPrice : originalPrice;

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      error("Please login to add items to wishlist");
      return;
    }

    if (wishlistLoading) return;

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(String(id));
        setIsInWishlist(false);
        success("Removed from wishlist");
      } else {
        await addToWishlist(String(id));
        setIsInWishlist(true);
        success("Added to wishlist");
      }
    } catch (err: any) {
      error(err.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <Link to={id ? `/product/${id}` : '#'}
      className="block h-full w-full cursor-pointer"
    >
      <article className="flex flex-col bg-slate-100 text-black rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full relative group">
        {/* Image Container - Takes upper 2/3 of card */}
        <div className="relative w-full flex-[2] min-h-[200px]">
          <div className="relative w-full h-full bg-gray-200 overflow-hidden rounded-t-lg group">
            <img
              src={image?.trim() ? image : "/product.png"}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            {/* Wishlist Button - Top Right Corner - Only visible on hover */}
            {user && (
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`absolute top-3 right-3 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-[-5px] group-hover:translate-y-0 hover:scale-110 ${
                  isInWishlist ? 'theme-text-primary' : 'text-white drop-shadow-lg'
                } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                style={isInWishlist ? { color: 'var(--theme-primary)' } : {}}
              >
                <Heart 
                  size={24} 
                  className={isInWishlist ? 'fill-current' : 'fill-white/20'}
                  strokeWidth={2.5}
                />
              </button>
            )}
          </div>
        </div>

        {/* Content Section - Takes lower 1/3 of card */}
        <div className="flex-1 p-4 flex flex-col justify-start bg-slate-100 rounded-b-lg relative">
          {/* Item Name */}
          <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{name}</h3>
          
          {/* Pricing Information with Discount Badge */}
          <div className="flex items-baseline gap-2 justify-between">
            <div className="flex items-baseline gap-2">
              {discountPercent > 0 ? (
                <>
                  <span className="text-sm text-gray-600 line-through">
                    {Math.round(originalPrice)}
                  </span>
                  <span className="text-sm font-semibold theme-text-primary">
                    Rs: {Math.round(discountedPrice)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold theme-text-primary">
                  Rs: {Math.round(numericPrice)}
                </span>
              )}
            </div>
            {/* Discount Badge - Bottom Right Corner aligned with price */}
            {offer && discountPercent > 0 && (
              <span className="theme-bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
