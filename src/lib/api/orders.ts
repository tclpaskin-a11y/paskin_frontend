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

  const result = (await response.json()) as any;
  if (result.success) {
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result.orders && Array.isArray(result.orders)) {
      return result.orders;
    }
  }
  throw new Error("Invalid response from server");
}

// Get pending orders (admin)
export async function getPendingOrders(): Promise<Order[]> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/orders/pending`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch pending orders");
  }

  const result = (await response.json()) as any;
  if (result.success) {
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result.orders && Array.isArray(result.orders)) {
      return result.orders;
    }
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

  const result = (await response.json()) as OrderResponse;
  if (result.success && result.order) {
    return result.order;
  }
  throw new Error("Invalid response from server");
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
): Promise<any> {
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

  // Calls the updated endpoint /admin/orders/:id/status using PATCH method
  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update order status");
  }

  const result = (await response.json()) as any;
  if (result.success) {
    if (result.data && !Array.isArray(result.data)) {
      return result.data;
    }
    if (result.order) {
      return result.order;
    }
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

// Get user orders: GET /orders
export async function getUserOrders(): Promise<any[]> {
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

  const result = (await response.json()) as any;
  if (result.success) {
    return result.data || result.orders || [];
  }
  throw new Error("Invalid response from server");
}

// Get single user order details: GET /orders/:orderId
export async function getUserOrder(orderId: string): Promise<any> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch order details");
  }

  const result = (await response.json()) as any;
  if (result.success) {
    return result.data || result.order || result;
  }
  throw new Error("Invalid response from server");
}

// Create new order: POST /orders
export async function createOrder(data: {
  contact: {
    name: string;
    mobile: string;
    email: string;
  };
  addressId: string;
  paymentMethod: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}): Promise<any> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to place order");
  }

  const result = (await response.json()) as any;
  if (result.success) {
    return result.data || result.order || result;
  }
  throw new Error("Failed to place order");
}
