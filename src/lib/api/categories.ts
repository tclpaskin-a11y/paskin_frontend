import { getAccessToken, API_BASE_URL } from "./client";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryResponse {
  success: boolean;
  category?: Category;
  categories?: Category[];
  data?: Category | Category[];
  message?: string;
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch categories");
  }

  const result = await response.json() as CategoryResponse;
  if (result.success) {
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result.categories) {
      return result.categories;
    }
  }
  throw new Error("Invalid response from server");
}

// Get single category
export async function getCategory(categoryId: string): Promise<Category> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch category");
  }

  const result = await response.json() as CategoryResponse;
  if (result.success) {
    if (result.data && !Array.isArray(result.data)) {
      return result.data;
    }
    if (result.category) {
      return result.category;
    }
  }
  throw new Error("Invalid response from server");
}

// Create category
export async function createCategory(data: Partial<Category>): Promise<Category> {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
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

  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create category");
  }

  const result = await response.json() as CategoryResponse;
  if (result.success) {
    if (result.data && !Array.isArray(result.data)) {
      return result.data;
    }
    if (result.category) {
      return result.category;
    }
  }
  throw new Error("Invalid response from server");
}

// Update category
export async function updateCategory(categoryId: string, data: Partial<Category>): Promise<Category> {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
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

  const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
    method: "PATCH",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update category");
  }

  const result = await response.json() as CategoryResponse;
  if (result.success) {
    if (result.data && !Array.isArray(result.data)) {
      return result.data;
    }
    if (result.category) {
      return result.category;
    }
  }
  throw new Error("Invalid response from server");
}

// Delete category
export async function deleteCategory(categoryId: string): Promise<void> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete category");
  }
}
