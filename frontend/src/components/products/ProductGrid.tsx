import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  discount?: number;
}

interface ProductGridProps {
  items: Product[];
  limit?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ items, limit }) => {
  const displayedItems = limit ? items.slice(0, limit) : items;

  return (
    <section className="py-10 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayedItems.map((product, index) => (
          <ProductCard
            key={product.id || index} // unique key
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image?.[0] ?? product.image ?? "/product.png"}
            offer={product.discount?.toString()}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
