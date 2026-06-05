import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  ShoppingBag, 
  Package, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { getUserDashboardStats } from "@/lib/api";

export default function DashboardIndex() {
  const { user } = useAuth();
  const username = user?.name || "User";
  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    totalCartItems: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getUserDashboardStats();
        setStatsData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    { icon: Package, count: statsData.totalOrders, label: "Total Orders", color: "blue" },
    { icon: CheckCircle2, count: statsData.deliveredOrders, label: "Delivered Orders", color: "emerald" },
    { icon: Clock, count: statsData.pendingOrders, label: "Pending Orders", color: "amber" },
    { icon: ShoppingBag, count: statsData.totalCartItems, label: "Cart Items", color: "primary" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl lg:text-4xl font-display font-bold tracking-tight text-foreground">
          Welcome Back, {username} 👋
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Manage your orders, cart and addresses easily.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard 
            key={stat.label} 
            {...stat} 
          />
        ))}
      </div>

      {/* Recent Activity or other sections can go here */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-3xl p-8 border border-border shadow-soft"
      >
        <h2 className="text-xl font-bold mb-4">Quick Overview</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl">
          <p className="text-muted-foreground">Recent order activity will be displayed here.</p>
        </div>
      </motion.div>
    </div>
  );
}
