import { getAccessToken, API_BASE_URL } from "./client";

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  success: boolean;
  cart?: Cart;
  message?: string;
}

// Get cart
export async function getCart(): Promise<Cart> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch cart");
  }

  const result = await response.json() as CartResponse;
  if (result.success && result.cart) {
    return result.cart;
  }
  throw new Error("Invalid response from server");
}

// Add to cart
export async function addToCart(productId: string, quantity: number): Promise<Cart> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/cart/items`, {
    method: "POST",
    headers,
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add to cart");
  }

  const result = await response.json() as CartResponse;
  if (result.success && result.cart) {
    return result.cart;
  }
  throw new Error("Invalid response from server");
}

// Update cart item quantity
export async function updateCartItem(productId: string, quantity: number): Promise<Cart> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update cart");
  }

  const result = await response.json() as CartResponse;
  if (result.success && result.cart) {
    return result.cart;
  }
  throw new Error("Invalid response from server");
}

// Remove from cart
export async function removeFromCart(productId: string): Promise<Cart> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to remove from cart");
  }

  const result = await response.json() as CartResponse;
  if (result.success && result.cart) {
    return result.cart;
  }
  throw new Error("Invalid response from server");
}

// Clear cart
export async function clearCart(): Promise<void> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to clear cart");
  }
}
