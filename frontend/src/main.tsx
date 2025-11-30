import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./lib/ThemeProvider";
import { CartProvider } from "@/components/products/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./index.css";

// Your public Stripe key (test or live)
const stripePromise = loadStripe("pk_test_your_public_key_here");

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          {/* Wrap your app in Elements for Stripe */}
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>
);
