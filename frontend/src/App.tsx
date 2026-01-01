import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/shop/Landing";
import Shop from "./pages/shop/Shop";
import ProductDetail from "./pages/shop/ProductDetail";
import CartPage from "./pages/shop/CartPage";
import PrivacyPolicy from "./pages/shop/PrivacyPolicy";
import TermsConditions from "./pages/shop/TermsConditions";
import FAQs from "./pages/shop/FAQs";
import ContactUs from "./pages/shop/ContactUs";
import UserProfile from "./pages/user/UserProfile";
import { CartProvider } from "./components/products/CartContext";
import AdminCategories from "@/pages/admin/pages/CategoriesPage";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Access from "./pages/auth/Access";
import Forgot from "./pages/auth/Forgot";
import AdminRoute from "./components/AdminRoute";
// lazy or normal — choose whichever you prefer
const AdminLayout = React.lazy(() => import("./pages/admin/layout/Adminlayout"));
const AdminProducts = React.lazy(() => import("./pages/admin/pages/ProductPage"));
const AdminSettings = React.lazy(() => import("./pages/admin/pages/SettingsPage"));
const AdminAssets = React.lazy(() => import("./pages/admin/pages/AssetsPage"));

// const AdminCategories = React.lazy(() => import("@/pages/admin/pages/CategoriesPage"));
const AdminDashboard = React.lazy(() => import("./pages/admin/pages/DashboardPage"));
const AdminOrders = React.lazy(() => import("./pages/admin/pages/OrdersPage"));
const AdminQueries = React.lazy(() => import("./pages/admin/pages/QueriesPage"));
const AdminReviews = React.lazy(() => import("./pages/admin/pages/ReviewsPage"));
const SpConsolePage = React.lazy(() => import("./pages/admin/pages/SpConsolePage"));
const DeveloperLayout = React.lazy(() => import("./pages/developer/layout/DeveloperLayout"));
const AdminTabsPage = React.lazy(() => import("./pages/developer/pages/AdminTabsPage"));
const CompanyPage = React.lazy(() => import("./pages/developer/pages/CompanyPage"));
const WebPagesPage = React.lazy(() => import("./pages/developer/pages/WebPagesPage"));
const ProfilePagesPage = React.lazy(() => import("./pages/developer/pages/ProfilePagesPage"));
const FooterPage = React.lazy(() => import("./pages/developer/pages/FooterPage"));
const SpComponentsPage = React.lazy(() => import("./pages/developer/pages/SpComponentsPage"));


export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Suspense fallback={<div>Loading...</div>}>
      <Routes>
             {/* ---------- SHOP ROUTES ---------- */}
      <Route path="/" element={<Landing />} />
      <Route path="/shop" element={<Shop />} />
       {/* Protected routes */}
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />

      {/* ---------- AUTH ROUTES (Login, Signup, Forgot) ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/access" element={<Access />} />
        <Route path="/forgot" element={<Forgot />} />

      {/* ---------- CONTENT PAGES (Privacy, Terms, FAQs, Contact) ---------- */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/contact-us" element={<ContactUs />} />

      {/* ---------- USER PROFILE ROUTE ---------- */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

                {/* ---------- PROTECTED ADMIN ROUTES ---------- */}
              <Route
  path="/admin/*"
  element={
    <AdminRoute>
      <Suspense fallback={<div>Loading admin...</div>}>
        <AdminLayout />
      </Suspense>
    </AdminRoute>
  }
>


  {/* ---------- ADMIN ROUTES ---------- */}
      {/* <Route path="/admin" element={<AdminLayout />}> */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="queries" element={<AdminQueries />} />
          <Route path="reviews" element={<AdminReviews />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="assets" element={<AdminAssets />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="sp-console" element={<SpConsolePage />} />
          </Route>

          {/* ---------- PROTECTED DEVELOPER ROUTES ---------- */}
          <Route
            path="/developer/*"
            element={
              <AdminRoute>
                <Suspense fallback={<div>Loading developer...</div>}>
                  <DeveloperLayout />
                </Suspense>
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="admin-tabs" replace />} />
            <Route path="admin-tabs" element={<AdminTabsPage />} />
            <Route path="company" element={<CompanyPage />} />
            <Route path="web-pages" element={<WebPagesPage />} />
            <Route path="profile-pages" element={<ProfilePagesPage />} />
            <Route path="footer" element={<FooterPage />} />
            <Route path="sp-components" element={<SpComponentsPage />} />
            <Route path="sp-console" element={<SpConsolePage />} />
          </Route>
   {/* ---------- 404 PAGE ---------- */}
          <Route path="*" element={<div>Not found</div>} />
      {/* add more routes later */}
    </Routes>
     </Suspense>
    </CartProvider>
    </AuthProvider>
    
     
    
  );
}
