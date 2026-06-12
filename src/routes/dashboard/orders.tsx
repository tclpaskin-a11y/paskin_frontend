import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight, Calendar, CreditCard, Truck, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserOrders } from "@/lib/api";

export default function DashboardOrders() {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const status = order.orderStatus || "ordered";
    if (activeTab === "all") return true;
    if (activeTab === "pending") {
      return status.toLowerCase() !== "delivered" && status.toLowerCase() !== "cancelled";
    }
    return status.toLowerCase() === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "pending":
      case "ordered":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "cancelled":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Your Orders</h1>
        <p className="text-muted-foreground mt-1">Check the status of your recent orders.</p>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-white p-1 rounded-2xl border border-border h-auto overflow-x-auto flex flex-nowrap w-full lg:w-auto hide-scrollbar justify-start sm:justify-center gap-1">
          <TabsTrigger
            value="all"
            className="rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
          >
            Total
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="delivered"
            className="rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
          >
            Delivered
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
          >
            Cancelled
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          {loading ? (
            <div className="py-20 flex items-center justify-center bg-white rounded-3xl border border-slate-100">
              <Loader className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const firstProduct = order.products?.[0]?.product || {};
                    const productName = firstProduct.name || "Order Item";
                    const productImage =
                      firstProduct.images?.[0] ||
                      "https://images.unsplash.com/photo-1611073103901-09605d8f6cc9?auto=format&fit=crop&q=80&w=300";
                    const orderDate = order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A";
                    const orderStatus = order.orderStatus || "ordered";
                    const displayStatus =
                      orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1);
                    const displayId = `#PASKIN-${order._id.slice(-6).toUpperCase()}`;

                    return (
                      <Card
                        key={order._id}
                        className="border-none shadow-soft hover:shadow-elegant transition-all group overflow-hidden"
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {/* Image */}
                            <div className="w-full md:w-40 lg:w-48 h-40 md:h-auto overflow-hidden bg-slate-50 border-b md:border-b-0 md:border-r border-border/50">
                              <img
                                src={productImage}
                                alt={productName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 p-5 md:p-6 space-y-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="space-y-1 text-left">
                                  <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">
                                    {displayId}
                                  </p>
                                  <h3 className="text-base md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                                    {productName}
                                    {order.products?.length > 1 &&
                                      ` + ${order.products.length - 1} more`}
                                  </h3>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold border-2 shrink-0 ${getStatusColor(orderStatus)}`}
                                >
                                  {displayStatus}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 py-4 border-y border-slate-50 text-left">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                      Date
                                    </span>
                                  </div>
                                  <p className="text-xs md:text-sm font-medium">{orderDate}</p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <CreditCard className="h-3 w-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                      Payment Status
                                    </span>
                                  </div>
                                  <p className="text-xs md:text-sm font-medium capitalize">
                                    {order.paymentStatus || "Pending"}
                                  </p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Truck className="h-3 w-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                      Amount
                                    </span>
                                  </div>
                                  <p className="text-xs md:text-sm font-bold text-primary">
                                    ₹{(order.totalAmount || 0).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex justify-end pt-2">
                                <Link to={`/orders/${order._id}`}>
                                  <Button
                                    variant="ghost"
                                    className="h-10 rounded-full hover:bg-primary/5 hover:text-primary gap-2 text-xs font-bold px-5"
                                  >
                                    View Details
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 stroke-1 opacity-20" />
                    <p className="text-muted-foreground font-medium">
                      No orders found in this category.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </Tabs>
    </div>
  );
}
