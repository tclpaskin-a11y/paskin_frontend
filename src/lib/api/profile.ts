import { getAccessToken, API_BASE_URL } from "./client";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  profilePicture?: string;
  addresses?: Array<{
    _id?: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileResponse {
  success: boolean;
  user?: UserProfile;
  message?: string;
}

// Get current user profile
export async function getUserProfile(): Promise<UserProfile> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch profile");
  }

  const result = await response.json() as ProfileResponse;
  if (result.success && result.user) {
    return result.user;
  }
  throw new Error("Invalid response from server");
}

// Update user profile
export async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update profile");
  }

  const result = await response.json() as ProfileResponse;
  if (result.success && result.user) {
    return result.user;
  }
  throw new Error("Invalid response from server");
}

// Update password
export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
    method: "POST",
    headers,
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update password");
  }
}

// Add address
export async function addAddress(address: {
  fullAddress: string;
  city: string;
  pincode: string;
  country: string;
}): Promise<any> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/address`, {
    method: "POST",
    headers,
    body: JSON.stringify(address),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add address");
  }

  const result = await response.json() as any;
  if (result.success && result.data) {
    return result.data;
  }
  throw new Error("Invalid response from server");
}

// Get addresses: GET /address
export async function getUserAddresses(): Promise<any[]> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/address`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch addresses");
  }

  const result = await response.json() as any;
  if (result.success && result.data) {
    return Array.isArray(result.data) ? result.data : [result.data];
  }
  throw new Error("Invalid response from server");
}

// Update address
export async function updateAddress(
  addressId: string,
  address: Partial<UserProfile["addresses"][0]>
): Promise<UserProfile> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/profile/addresses/${addressId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(address),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update address");
  }

  const result = await response.json() as ProfileResponse;
  if (result.success && result.user) {
    return result.user;
  }
  throw new Error("Invalid response from server");
}

// Delete address
export async function deleteAddress(addressId: string): Promise<UserProfile> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/profile/addresses/${addressId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete address");
  }

  const result = await response.json() as ProfileResponse;
  if (result.success && result.user) {
    return result.user;
  }
  throw new Error("Invalid response from server");
}
