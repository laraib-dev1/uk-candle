import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  discount?: number;
};

type CartContextType = {
  cartItems: CartItem[];
  totalItems: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

const GUEST_CART_ID_KEY = "guestCartId";

function getGuestCartId(): string {
  if (typeof sessionStorage === "undefined") return "guest";
  let id = sessionStorage.getItem(GUEST_CART_ID_KEY);
  if (!id) {
    id = "guest_" + Math.random().toString(36).slice(2) + "_" + Date.now();
    sessionStorage.setItem(GUEST_CART_ID_KEY, id);
  }
  return id;
}

function getCartKey(user: { id?: string; _id?: string } | null): string {
  if (user) {
    const id = user.id || user._id;
    if (id) return `cartItems_${id}`;
  }
  return `cartItems_${getGuestCartId()}`;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const cartKey = getCartKey(user);

  const loadCart = useCallback(() => {
    try {
      const stored = localStorage.getItem(cartKey);
      setCartItems(stored ? JSON.parse(stored) : []);
    } catch {
      setCartItems([]);
    }
  }, [cartKey]);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(cartKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // When user changes (login/logout), load that user's cart
  useEffect(() => {
    loadCart();
  }, [loadCart, cartKey]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Failed to save cart", e);
    }
  }, [cartItems, cartKey]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const increaseQuantity = (id: string) => {
    setCartItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );
  };

  // Calculate total items in cart
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const clearCart = () => {
    setCartItems([]); // empties the cart
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems, // ✅ provide totalItems to context
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
