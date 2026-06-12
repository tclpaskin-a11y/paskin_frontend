import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Menu, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Overview";
    if (path === "/dashboard/cart") return "My Cart";
    if (path === "/dashboard/orders") return "Order History";
    if (path === "/dashboard/address") return "Addresses";
    return "Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 flex-shrink-0 z-40">
        <Sidebar />
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Header (visible on both mobile and desktop) */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-white border-b border-slate-200/60 z-30 flex items-center px-6 justify-between shadow-sm">
          {/* Left: Menu trigger on mobile, page title on desktop */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <Sidebar onClose={() => setIsMobileOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
            <h2 className="font-bold text-lg">{getPageTitle()}</h2>
          </div>

          {/* Right: "Go to Main Website" Link on desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 text-primary text-xs font-bold hover:bg-primary/5 transition-all shadow-sm"
            >
              <Store className="h-3.5 w-3.5" />
              Go to Main Website
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 pt-16">
          <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
