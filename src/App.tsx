import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider } from "@/hooks/use-auth";

// Pages
import Index from "./routes/index";
import AboutPage from "./routes/about";
import AboutUsPage from "./routes/about-us";
import BlogPage from "./routes/blog";
import BlogDetailsPage from "./routes/blog.$id";
import CheckoutPage from "./routes/checkout";
import ContactPage from "./routes/contact";
import LoginPage from "./routes/login";
import PartnerPage from "./routes/partner";
import SignupPage from "./routes/signup";
import ProductsLayout from "./routes/products";
import ProductsPage from "./routes/products.index";
import ProductDetailsPage from "./routes/products.$id";
import ShippingPolicyPage from "./routes/shipping-policy";
import PrivacyPolicyPage from "./routes/privacy-policy";
import TermsConditionsPage from "./routes/terms-and-conditions";
import ReturnsPolicyPage from "./routes/returns-policy";
import OrderDetailsPage from "./routes/orders.$id";


// Dashboard
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardIndex from "./routes/dashboard/index";
import DashboardCart from "./routes/dashboard/cart";
import DashboardOrders from "./routes/dashboard/orders";
import DashboardAddress from "./routes/dashboard/address";

// Admin
import { AdminLayout } from "./layouts/admin/AdminLayout";
import AdminLogin from "./routes/admin/login";
import AdminDashboard from "./routes/admin/dashboard";
import AdminCategories from "./routes/admin/categories";
import AdminProducts from "./routes/admin/products";
import AdminOrders from "./routes/admin/orders";
import AdminBlog from "./routes/admin/blog";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-medium text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Back home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
            <Route path="/returns-policy" element={<ReturnsPolicyPage />} />

            
            <Route path="/orders/:id" element={<OrderDetailsPage />} />

            <Route path="/products" element={<ProductsLayout />}>
              <Route index element={<ProductsPage />} />
              <Route path=":id" element={<ProductDetailsPage />} />
            </Route>

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardIndex />} />
              <Route path="cart" element={<DashboardCart />} />
              <Route path="orders" element={<DashboardOrders />} />
              <Route path="address" element={<DashboardAddress />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="category" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="blog" element={<AdminBlog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);
}
