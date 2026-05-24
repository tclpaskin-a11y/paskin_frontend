import { NavLink, Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Layers, 
  Package, 
  ShoppingBag, 
  BookOpen, 
  LogOut, 
  X,
  ChevronRight
} from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const API_BASE_URL = "https://api.paskin.co.in/api";

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin/dashboard" },
  { icon: Layers, label: "Categories", to: "/admin/category" },
  { icon: Package, label: "Products", to: "/admin/products" },
  { icon: ShoppingBag, label: "Orders", to: "/admin/orders" },
  { icon: BookOpen, label: "Blog", to: "/admin/blog" },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("admin-refreshToken");
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
      localStorage.removeItem("admin-auth");
      localStorage.removeItem("admin-accessToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("admin-refreshToken");
      localStorage.removeItem("admin-user");
      toast.success("Logged out successfully");
      navigate("/admin");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] text-slate-300 border-r border-white/5">
      {/* Brand Header */}
      <div className="p-8 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
          onClick={onClose}
        >
          <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-all">
            <img src={logo} alt="PASKIN" className="h-8 w-auto" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">Admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Main Menu</p>
        {adminMenuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => 
              cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "hover:bg-white/5 hover:text-white"
              )
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              {item.label}
            </div>
            <ChevronRight className="h-4 w-4 opacity-0 group-[.active]:opacity-50 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 mt-auto">
        <div className="bg-white/5 rounded-[2rem] p-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-4 rounded-[1.5rem] text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all group"
          >
            <div className="bg-rose-500/10 p-2 rounded-xl group-hover:bg-rose-500/20 transition-colors">
              <LogOut className="h-5 w-5" />
            </div>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
