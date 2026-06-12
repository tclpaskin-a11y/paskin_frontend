import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { Menu, Bell, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Simple auth check
  useEffect(() => {
    const isAuth = localStorage.getItem("admin-auth") === "true";
    if (!isAuth && location.pathname !== "/admin") {
      navigate("/admin");
    }
  }, [location.pathname, navigate]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Overview";
    if (path.includes("/category")) return "Categories";
    if (path.includes("/products")) return "Inventory";
    if (path.includes("/orders")) return "Orders";
    if (path.includes("/blog")) return "Blog Posts";
    return "Admin";
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 h-screen sticky top-0 flex-shrink-0 shadow-2xl z-50">
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 z-[70] lg:hidden"
            >
              <AdminSidebar onClose={() => setIsMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center px-6 lg:px-10 justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu className="h-6 w-6 text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">{getPageTitle()}</h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-slate-100 border-transparent rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button className="p-2.5 hover:bg-slate-100 rounded-full text-slate-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1" />
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                  Admin User
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Super Admin
                </p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary-glow p-0.5 shadow-lg group-hover:scale-105 transition-transform">
                <div className="h-full w-full rounded-[0.875rem] bg-white flex items-center justify-center overflow-hidden">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
