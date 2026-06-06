import { getAccessToken, API_BASE_URL } from "./client";

export interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  sellPrice: number;
  gst: number;
  category: {
    _id: string;
    name: string;
  } | string;
  images?: string[];
  color?: string;
  size?: string;
  stock?: number;
  inStock?: boolean;
  benefits?: string;
  usage?: string;
  ingredients?: string;
  isPaused?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ProductResponse {
  success: boolean;
  data?: Product | Product[];
  product?: Product; // legacy support
  products?: Product[]; // legacy support
  message?: string;
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch products");
  }

  const result = await response.json() as ProductResponse;
  if (result.success) {
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result.products) {
      return result.products;
    }
  }
  throw new Error("Invalid response from server");
}

// Get single product
export async function getProduct(productId: string): Promise<Product> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch product");
  }

  const result = await response.json() as ProductResponse;
  if (result.success) {
    if (result.data && !Array.isArray(result.data)) {
      return result.data;
    }
    if (result.product) {
      return result.product;
    }
  }
  throw new Error("Invalid response from server");
}

// Create product using FormData (multer)
export async function createProduct(data: any): Promise<Product> {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          // If array is files (multer supports multiple files under same field name or different)
          if (item instanceof File) {
            formData.append(key, item);
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const token = getAccessToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create product");
  }

  const result = await response.json() as ProductResponse;
  if (result.success) {
    if (result.data && !Array.isArray(result.data)) {
      return result.data;
    }
    if (result.product) {
      return result.product;
    }
  }
  throw new Error("Invalid response from server");
}

// Update product using FormData
export async function updateProduct(productId: string, data: any): Promise<Product> {
  const getFormData = () => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(key, item);
            } else {
              formData.append(`${key}[${index}]`, item);
            }
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  };

  const token = getAccessToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Update endpoint is PATCH in backend
  const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
    method: "PATCH",
    headers,
    body: getFormData(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update product");
  }

  const result = await response.json() as ProductResponse;
  if (result.success) {
    if (result.data && !Array.isArray(result.data)) {
      return result.data;
    }
    if (result.product) {
      return result.product;
    }
  }
  throw new Error("Invalid response from server");
}

// Delete product
export async function deleteProduct(productId: string): Promise<void> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete product");
  }
}

// Get public products (GET)
export async function getPublicProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch products");
  }

  const result = await response.json() as ProductResponse;
  if (result.success) {
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result.products) {
      return result.products;
    }
  }
  throw new Error("Invalid response from server");
}

// Get single public product (GET)
export async function getPublicProduct(productId: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch product details");
  }

  const result = await response.json() as ProductResponse;
  if (result.success) {
    if (result.data && !Array.isArray(result.data)) {
      return result.data;
    }
    if (result.product) {
      return result.product;
    }
  }
  throw new Error("Invalid response from server");
}

// Search public products (GET)
export async function searchPublicProducts(q: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(q)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to search products");
  }

  const result = await response.json() as ProductResponse;
  if (result.success) {
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result.products) {
      return result.products;
    }
  }
  throw new Error("Invalid response from server");
}
