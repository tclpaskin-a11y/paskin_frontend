import React, { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = "https://api.paskin.co.in/api";

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  createdAt?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (name: string, email: string, mobile: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getSimpleErrorMessage(error: string): string {
  // Map common API errors to simple messages
  const errorMap: Record<string, string> = {
    "User not found": "No account found with this email or mobile number.",
    "Invalid password": "The password you entered is incorrect.",
    "User already exists": "An account with this email or mobile already exists.",
    "Invalid credentials": "Please check your email/mobile and password.",
    "Token expired": "Your session has expired. Please login again.",
    "Invalid token": "Your session is invalid. Please login again.",
    "Network error": "Unable to connect. Please check your internet connection.",
  };

  return errorMap[error] || "Something went wrong. Please try again.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("accessToken");
  });

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const savedUser = localStorage.getItem("paskin-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("paskin-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("paskin-user");
    }
  }, [user]);

  const login = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.success) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setUser(data.user);
        setIsLoggedIn(true);
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      const message = error.message || "Network error occurred";
      throw new Error(getSimpleErrorMessage(message));
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, mobile: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, mobile, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      if (data.success) {
        // After signup, user needs to login
        // Optionally, auto-login after signup
      } else {
        throw new Error("Signup failed");
      }
    } catch (error: any) {
      const message = error.message || "Network error occurred";
      throw new Error(getSimpleErrorMessage(message));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("paskin-user");
      setUser(null);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Token refresh failed");
      }

      if (data.success) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error: any) {
      // If refresh fails, logout
      await logout();
      throw new Error("Session expired. Please login again.");
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, signup, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
