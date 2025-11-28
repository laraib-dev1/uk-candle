import React from "react";
import { Link } from "react-router-dom";

type Props = {
  id: string | number;
  name: string;
  price: number | string;
  image?: string;
  offer?: string;
};

export default function ProductCard({ id, name, price, image, offer }: Props) {
  return (
    <Link to={id ? `/product/${id}` : '#'}
    className="block h-full w-full cursor-pointer"
    >
      <article className="flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white rounded overflow-hidden hover:shadow-lg transition">
        <div className="relative aspect-w-3 aspect-h-4 w-full bg-gray-100 overflow-hidden">
          {/* {offer && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
              {offer}
            </span>
          )} */}
          <img
            src={image && image.trim() ? image : "/product.png"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4 flex flex-col text-left">
          <h3 className="text-base font-medium text-gray-900">{name}</h3>
          <div className="mt-2 flex items-center gap-2">
            {offer && (
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                {offer}% OFF
              </span>
            )}
            <span className="text-sm font-semibold">${price}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
