// API Client
export {
  getAccessToken,
  getAuthHeaders,
  getFormDataAuthHeaders,
  API_BASE_URL,
  apiCall,
} from "./client";

// Blogs API
export {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  getPublicBlogs,
  getPublicBlog,
} from "./blogs";
export type { Blog, BlogData, BlogResponse } from "./blogs";

// Products API
export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getPublicProducts,
  getPublicProduct,
  searchPublicProducts,
} from "./products";
export type { Product, ProductResponse } from "./products";

// Categories API
export {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getPublicCategories,
} from "./categories";
export type { Category, CategoryResponse } from "./categories";

// Orders API
export {
  getAllOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getUserOrders,
  getUserOrder,
  getPendingOrders,
  createOrder,
  resolveOrder,
} from "./orders";
export type { Order, OrderResponse } from "./orders";

// Profile API
export {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserAddresses,
} from "./profile";
export type { UserProfile, ProfileResponse } from "./profile";

// Cart API
export { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "./cart";
export type { Cart, CartItem, CartResponse } from "./cart";

// Dashboard API
export { getDashboardStats, getUserDashboardStats } from "./dashboard";
export type {
  DashboardData,
  DashboardResponse,
  UserDashboardData,
  UserDashboardResponse,
} from "./dashboard";

// Razorpay API
export {
  loadRazorpayScript,
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayPayment,
} from "./razorpay";
export type {
  RazorpayOrderRequest,
  RazorpayOrderResponse,
  RazorpayVerificationRequest,
  RazorpayVerificationResponse,
  RazorpayPaymentData,
} from "./razorpay";

// Error Mapper API
export { getReadableErrorMessage } from "./error-mapper";
