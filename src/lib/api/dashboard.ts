import { apiCall } from "./client";

export interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalPayments: number;
  pendingOrders: number;
  pendingPayments: number;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export async function getDashboardStats(): Promise<DashboardData> {
  const result = await apiCall<DashboardResponse>("/admin/dashboard", {
    method: "GET",
  });
  if (result.success && result.data) {
    return result.data;
  }
  throw new Error("Failed to load dashboard statistics");
}
