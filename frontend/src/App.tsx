import React from "react";
import {  BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/shop/Landing";
import Shop from "./pages/shop/Shop";
import ProductDetail from "./pages/shop/ProductDetail";
import CartPage from "./pages/shop/CartPage";

// lazy or normal — choose whichever you prefer
const AdminLayout = React.lazy(() => import("./pages/admin/layout/Adminlayout"));
const AdminProducts = React.lazy(() => import("./pages/admin/pages/ProductPage"));
const AdminCategories = React.lazy(() => import("./pages/admin/pages/CategoriesPage"));
const AdminDashboard = React.lazy(() => import("./pages/admin/pages/DashboardPage"));
const AdminOrders = React.lazy(() => import("./pages/admin/pages/OrdersPage"));

import Login from "./pages/auth/Login";
import Access from "./pages/auth/Access";
import Forgot from "./pages/auth/Forgot";

export default function App() {
  return (
    
    <Routes>
             {/* ---------- SHOP ROUTES ---------- */}
      <Route path="/" element={<Landing />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} /> 

      {/* ---------- AUTH ROUTES (Login, Signup, Forgot) ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/access" element={<Access />} />
        <Route path="/forgot" element={<Forgot />} />

  {/* ---------- ADMIN ROUTES ---------- */}
      <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
          </Route>
   {/* ---------- 404 PAGE ---------- */}
          <Route path="*" element={<div>Not found</div>} />
      {/* add more routes later */}
    </Routes>
  );
}
