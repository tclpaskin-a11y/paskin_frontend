const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.paskin.co.in/api";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken") || localStorage.getItem("admin-accessToken");
}

export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
}

export function getFormDataAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = options.headers || getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message ||
      errorData.error ||
      `HTTP Error: ${response.status}`;
    throw new Error(errorMessage);
  }

  try {
    return await response.json() as T;
  } catch {
    return {} as T;
  }
}

export { API_BASE_URL };
