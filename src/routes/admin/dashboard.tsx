import { motion } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  CreditCard,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardStats } from "@/lib/api";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState("Admin");
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUser = localStorage.getItem("admin-user");
    if (adminUser) {
      try {
        const user = JSON.parse(adminUser);
        setAdminName(user.name || "Admin");
      } catch (error) {
        // Ignore parse errors
      }
    }

    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStatsData(data);
      } catch (error: any) {
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const stats = statsData
    ? [
        {
          label: "Total Orders",
          value: String(statsData.totalOrders ?? 0),
          icon: ShoppingBag,
          color: "blue",
          growth: "+12.5%",
          positive: true,
        },
        {
          label: "Total Revenue",
          value: `₹${(statsData.totalRevenue ?? 0).toLocaleString()}`,
          icon: DollarSign,
          color: "emerald",
          growth: "+8.2%",
          positive: true,
        },
        {
          label: "Total Payments",
          value: `₹${(statsData.totalPayments ?? 0).toLocaleString()}`,
          icon: CreditCard,
          color: "violet",
          growth: "+10.1%",
          positive: true,
        },
        {
          label: "Pending Orders",
          value: String(statsData.pendingOrders ?? 0),
          icon: Clock,
          color: "amber",
          growth: "-2.4%",
          positive: false,
        },
        {
          label: "Pending Payments",
          value: `₹${(statsData.pendingPayments ?? 0).toLocaleString()}`,
          icon: TrendingUp,
          color: "rose",
          growth: "+4.2%",
          positive: true,
        },
      ]
    : [
        {
          label: "Total Orders",
          value: loading ? "..." : "0",
          icon: ShoppingBag,
          color: "blue",
          growth: "+0%",
          positive: true,
        },
        {
          label: "Total Revenue",
          value: loading ? "..." : "₹0",
          icon: DollarSign,
          color: "emerald",
          growth: "+0%",
          positive: true,
        },
        {
          label: "Total Payments",
          value: loading ? "..." : "₹0",
          icon: CreditCard,
          color: "violet",
          growth: "+0%",
          positive: true,
        },
        {
          label: "Pending Orders",
          value: loading ? "..." : "0",
          icon: Clock,
          color: "amber",
          growth: "+0%",
          positive: false,
        },
        {
          label: "Pending Payments",
          value: loading ? "..." : "₹0",
          icon: TrendingUp,
          color: "rose",
          growth: "+0%",
          positive: true,
        },
      ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome {adminName} 👋</h2>
        <p className="text-slate-500 mt-2">
          Manage products, orders, categories and blogs efficiently.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold ${stat.positive ? "text-emerald-500" : "text-rose-500"}`}
              >
                {stat.growth}
                {stat.positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
