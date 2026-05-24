import { getAccessToken, API_BASE_URL } from "./client";

export interface Order {
  _id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: string;
  trackingNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderResponse {
  success: boolean;
  order?: Order;
  orders?: Order[];
  message?: string;
}

// Get all orders (admin)
export async function getAllOrders(): Promise<Order[]> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/orders`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch orders");
  }

  const result = await response.json() as OrderResponse;
  if (result.success && result.orders) {
    return result.orders;
  }
  throw new Error("Invalid response from server");
}

// Get single order
export async function getOrder(orderId: string): Promise<Order> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch order");
  }

  const result = await response.json() as OrderResponse;
  if (result.success && result.order) {
    return result.order;
  }
  throw new Error("Invalid response from server");
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  trackingNumber?: string
): Promise<Order> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const body: any = { status };
  if (trackingNumber) {
    body.trackingNumber = trackingNumber;
  }

  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update order");
  }

  const result = await response.json() as OrderResponse;
  if (result.success && result.order) {
    return result.order;
  }
  throw new Error("Invalid response from server");
}

// Delete order
export async function deleteOrder(orderId: string): Promise<void> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete order");
  }
}

// Get user orders
export async function getUserOrders(): Promise<Order[]> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch orders");
  }

  const result = await response.json() as OrderResponse;
  if (result.success && result.orders) {
    return result.orders;
  }
  throw new Error("Invalid response from server");
}
