import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/shop/Landing";
import Shop from "./pages/shop/Shop";
import ProductDetail from "./pages/shop/ProductDetail";
import CartPage from "./pages/shop/CartPage";
export default function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} /> 
      
      {/* add more routes later */}
    </Routes>
  );
}
