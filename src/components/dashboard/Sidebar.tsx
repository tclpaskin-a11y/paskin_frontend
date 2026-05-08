import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MapPin,
  Store,
  LogOut,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: ShoppingBag, label: "Cart", to: "/dashboard/cart" },
  { icon: Package, label: "Orders", to: "/dashboard/orders" },
  { icon: MapPin, label: "Address", to: "/dashboard/address" },
  { icon: Store, label: "Back to Store", to: "/" },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-border">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={onClose}
        >
          <img src={logo} alt="PASKIN" className="h-10 w-auto transition-transform group-hover:scale-105" />
          <span className="font-display text-xl font-bold tracking-tight">to</span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-elegant"
                  : "text-foreground/70 hover:bg-slate-50 hover:text-foreground"
              )
            }
          >
            <item.icon className={cn(
              "h-5 w-5 transition-transform group-hover:scale-110",
              "group-[.active]:scale-100"
            )} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-border mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors group"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Logout
        </button>
      </div>
    </div>
  );
}
