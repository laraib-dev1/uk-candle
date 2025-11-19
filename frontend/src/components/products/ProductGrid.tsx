import React from "react";
import { Card, CardContent } from "../ui/Card";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  title: string;
  price: number;
  image?: string;
  offer?: string;
}

interface ProductGridProps {
  items: Product[];
  limit?: number; 
}

const ProductGrid: React.FC<ProductGridProps> = ({ items, limit }) => {
  const displayedItems = limit ? items.slice(0, limit) : items; // slice if limit provided

  return (
    <section className="py-10 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
       {displayedItems.map((product) => (
  <ProductCard
    key={product.id}
    id={product.id} 
    title={product.title}
    price={product.price}
    image={product.image}
    offer={product.offer}
  />
))}
      </div>
    </section>
  );
};

export default ProductGrid;
