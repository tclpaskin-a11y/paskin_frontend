import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/components/site/ProductCard";
import { useAuth } from "@/hooks/use-auth";
import { getCart, addToCart, updateCartItem, removeFromCart } from "@/lib/api";
import { toast } from "sonner";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("paskin-cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [cartId, setCartId] = useState<string | null>(null);

  // Sync cart from backend when logged in
  const syncCart = async () => {
    if (!isLoggedIn) return;
    try {
      const cart = await getCart();
      setCartId(cart._id);
      
      // Map backend products to CartItem interface
      const mappedItems = cart.products.map((item: any) => {
        const prod = typeof item.productId === "object" ? item.productId : {};
        return {
          id: prod._id || item.productId,
          name: prod.name || "Product",
          price: prod.sellPrice || 0,
          oldPrice: prod.basePrice || undefined,
          rating: prod.rating || 4.8,
          reviews: prod.reviews || 120,
          image: prod.images?.[0] || "https://images.unsplash.com/photo-1611073103901-09605d8f6cc9?auto=format&fit=crop&q=80&w=300",
          quantity: item.quantity || 1,
          category: typeof prod.category === "object" ? prod.category.name : (prod.category || "Pharma"),
        };
      });
      setItems(mappedItems);
    } catch (error) {
      console.error("Failed to sync cart", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      syncCart();
    } else {
      setItems([]);
      setCartId(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoggedIn) {
      localStorage.setItem("paskin-cart", JSON.stringify(items));
    }
  }, [items, isLoggedIn]);

  const addToCartFn = async (product: Product) => {
    if (!isLoggedIn) {
      // Save current path to redirect back after login
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem("redirectAfterLogin", currentPath);
      toast.info("Please login to add items to your cart");
      window.location.href = "/login";
      return;
    }

    try {
      // Call backend API (quantity=1)
      const updatedCart = await addToCart(product.id, 1);
      setCartId(updatedCart._id);
      await syncCart();
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  const removeFromCartFn = async (productId: string) => {
    if (!isLoggedIn) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }

    try {
      // If we have cartId, we can remove the cart item or entire cart
      if (cartId) {
        await removeFromCart(cartId);
        setItems([]);
        toast.success("Item removed from cart!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const updateQuantityFn = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCartFn(productId);
      return;
    }

    if (!isLoggedIn) {
      setItems((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
      return;
    }

    try {
      const updatedCart = await updateCartItem(productId, quantity);
      setCartId(updatedCart._id);
      await syncCart();
    } catch (error: any) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const clearCartFn = async () => {
    if (!isLoggedIn) {
      setItems([]);
      return;
    }
    try {
      if (cartId) {
        await removeFromCart(cartId);
        setItems([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to clear cart");
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart: addToCartFn,
        removeFromCart: removeFromCartFn,
        updateQuantity: updateQuantityFn,
        clearCart: clearCartFn,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
