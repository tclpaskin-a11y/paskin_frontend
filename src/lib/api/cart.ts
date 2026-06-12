import { getAccessToken, API_BASE_URL } from "./client";

export interface CartItem {
  productId: any; // Can be string or populated object { _id, name, sellPrice, images }
  quantity: number;
  _id?: string;
}

export interface Cart {
  _id: string;
  userId: string;
  products: CartItem[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CartResponse {
  success: boolean;
  data?: Cart;
  message?: string;
}

// Get cart: GET /cart
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch cart");
  }

  const result = (await response.json()) as CartResponse;
  if (result.success && result.data) {
    return result.data;
  }
  throw new Error("Invalid response from server");
}

// Add to cart: POST /cart/add
export async function addToCart(productId: string, quantity: number): Promise<Cart> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers,
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add to cart");
  }

  const result = (await response.json()) as CartResponse;
  if (result.success && result.data) {
    return result.data;
  }
  throw new Error("Invalid response from server");
}

// Update cart: PATCH /cart/update
export async function updateCartItem(productId: string, quantity: number): Promise<Cart> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/cart/update`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update cart");
  }

  const result = (await response.json()) as CartResponse;
  if (result.success && result.data) {
    return result.data;
  }
  throw new Error("Invalid response from server");
}

// Remove from cart: DELETE /cart/remove/:productId
export async function removeFromCart(productId: string): Promise<Cart> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to remove from cart");
  }

  const result = (await response.json()) as CartResponse;
  if (result.success && result.data) {
    return result.data;
  }
  throw new Error("Invalid response from server");
}

// Clear cart (helper local fallback)
export async function clearCart(): Promise<void> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        // If the endpoint is not found (404), it indicates the backend either automatically
        // clears the cart when an order is placed or doesn't expose a manual clear endpoint.
        // We return successfully to allow the local cart state to clear.
        console.warn("DELETE /cart returned 404. Treating as success to clear local cart state.");
        return;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to clear cart");
    }
  } catch (err: any) {
    // If it's a 404 error, ignore it
    if (err.message && (err.message.includes("404") || err.message.includes("Not Found"))) {
      return;
    }
    throw err;
  }
}
