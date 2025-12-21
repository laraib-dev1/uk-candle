import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider as LightDarkThemeProvider } from "./lib/ThemeProvider";
import { ThemeProvider as BrandThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "@/components/products/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./index.css";
import { AuthProvider } from "./hooks/useAuth";
// Your public Stripe key (test or live)
const stripePromise = loadStripe("pk_test_51SZR8tBr6feLHBsTihpvakcYTtUKzYmD86ImCvthYHPAdpzT8KHGOmt4Edqs09Ai9uKyPhVElHC87Yoah3esy3Ot00xQrnQCWL");

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LightDarkThemeProvider>
      <BrandThemeProvider>
        <CartProvider>
          <AuthProvider>
            <BrowserRouter>
            {/* Wrap your app in Elements for Stripe */}
            <Elements stripe={stripePromise}>
              <App />
            </Elements>
          </BrowserRouter>
          </AuthProvider>
        </CartProvider>
      </BrandThemeProvider>
    </LightDarkThemeProvider>
  </React.StrictMode>
);
