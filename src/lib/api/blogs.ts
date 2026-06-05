import { getAccessToken, API_BASE_URL } from "./client";
import { fallbackBlogs } from "../../data/blogs";

export interface BlogData {
  title: string;
  description: string;
  media?: File | File[];
  isPublished?: boolean;
}

export interface Blog {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  createdBy: string | {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface BlogResponse {
  success: boolean;
  blog?: Blog | Blog[];
  data?: Blog | Blog[];
  message?: string;
}

// Create a new blog post (POST)
export async function createBlog(data: BlogData): Promise<Blog> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  
  if (data.media) {
    if (Array.isArray(data.media)) {
      data.media.forEach((file) => formData.append("media", file));
    } else {
      formData.append("media", data.media);
    }
  }
  
  if (data.isPublished !== undefined) {
    formData.append("isPublished", String(data.isPublished));
  }

  const token = getAccessToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/blogs`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create blog");
  }

  const result = await response.json() as BlogResponse;
  if (result.success) {
    if (result.data && !Array.isArray(result.data)) {
      return result.data;
    }
    if (result.blog && !Array.isArray(result.blog)) {
      return result.blog;
    }
  }
  throw new Error("Invalid response from server");
}

// Get all blogs (GET)
export async function getAllBlogs(): Promise<Blog[]> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/blogs`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch blogs");
  }

  const result = await response.json() as BlogResponse;
  if (result.success) {
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result.blog && Array.isArray(result.blog)) {
      return result.blog;
    }
  }
  throw new Error("Invalid response from server");
}

// Update a blog post (PUT)
export async function updateBlog(blogId: string, data: BlogData): Promise<Blog> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  
  if (data.media) {
    if (Array.isArray(data.media)) {
      data.media.forEach((file) => formData.append("media", file));
    } else {
      formData.append("media", data.media);
    }
  }
  
  if (data.isPublished !== undefined) {
    formData.append("isPublished", String(data.isPublished));
  }

  const token = getAccessToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/blogs/${blogId}`, {
    method: "PATCH",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update blog");
  }

  const result = await response.json() as BlogResponse;
  if (result.success) {
    if (result.data && !Array.isArray(result.data)) {
      return result.data;
    }
    if (result.blog && !Array.isArray(result.blog)) {
      return result.blog;
    }
  }
  throw new Error("Invalid response from server");
}

// Delete a blog post (DELETE)
export async function deleteBlog(blogId: string): Promise<void> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/blogs/${blogId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete blog");
  }
}

// Get public blogs (GET)
export async function getPublicBlogs(): Promise<Blog[]> {
  let apiBlogs: Blog[] = [];
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json() as BlogResponse;
      if (result.success) {
        if (result.blog && Array.isArray(result.blog)) {
          apiBlogs = result.blog;
        } else if (result.data && Array.isArray(result.data)) {
          apiBlogs = result.data;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch public blogs from API, using fallbacks:", error);
  }

  // Merge apiBlogs and fallbackBlogs (by _id to prevent duplicates)
  const merged = [...apiBlogs];
  for (const fb of fallbackBlogs) {
    if (!merged.some(b => b._id === fb._id)) {
      merged.unshift(fb as any);
    }
  }
  return merged;
}

// Get single public blog (GET)
export async function getPublicBlog(blogId: string): Promise<Blog> {
  if (blogId === "6a227afceb0607fc889f622c") {
    const fb = fallbackBlogs.find(b => b._id === blogId);
    if (fb) return fb as any;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json() as BlogResponse;
      if (result.success) {
        if (result.blog && !Array.isArray(result.blog)) {
          return result.blog;
        }
        if (result.data && !Array.isArray(result.data)) {
          return result.data;
        }
      }
    }
  } catch (error) {
    console.error(`Failed to fetch public blog ${blogId} from API, checking fallbacks:`, error);
  }

  const fb = fallbackBlogs.find(b => b._id === blogId);
  if (fb) return fb as any;

  throw new Error("Failed to fetch blog details");
}

