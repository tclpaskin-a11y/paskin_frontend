import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  User,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  Loader,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { getAllOrders, getPendingOrders, updateOrderStatus } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ORDER_STEPS = ["ordered", "approved", "shipped", "out_for_delivery", "delivered"];

const STATUS_LABELS: Record<string, string> = {
  ordered: "Ordered",
  approved: "Approved",
  shipped: "Shipped",
  out_for_delivery: "Out For Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState("total");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch orders based on active tab
  const fetchOrders = async () => {
    try {
      setLoading(true);
      let data;
      if (activeTab === "pending") {
        data = await getPendingOrders();
      } else {
        data = await getAllOrders();
      }

      // Add temporary debugging to verify exact field mappings
      console.log("Orders API Response:", data);

      // Ensure data is an array
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      setStatusUpdatingId(id);
      await updateOrderStatus(id, newStatus);
      toast.success(`Order status updated to "${STATUS_LABELS[newStatus] || newStatus}" successfully!`);
      await fetchOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatOrderDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const status = (order.orderStatus || order.status || "").toLowerCase();
    if (activeTab === "total") return true;
    if (activeTab === "pending") return status === "ordered" || status === "pending";
    if (activeTab === "completed") return status === "delivered";
    if (activeTab === "cancel") return status === "cancelled" || status === "cancel";
    return true;
  });

  // Skeleton Loader UI Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 animate-pulse space-y-6 shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-50 pb-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-100 rounded" />
          <div className="h-3 w-40 bg-slate-100 rounded" />
        </div>
        <div className="h-8 w-24 bg-slate-100 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="h-3 w-16 bg-slate-100 rounded" />
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 bg-slate-100 rounded" />
              <div className="h-3 w-1/2 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 w-16 bg-slate-100 rounded" />
          <div className="h-4 w-32 bg-slate-100 rounded" />
          <div className="h-3 w-24 bg-slate-100 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-16 bg-slate-100 rounded" />
          <div className="h-10 w-full bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );

  // Empty State UI Component
  const EmptyState = () => (
    <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center p-8 shadow-sm">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
        <Package className="h-8 w-8 stroke-1" />
      </div>
      <h3 className="text-xl font-bold text-slate-800">No Orders Found</h3>
      <p className="text-slate-500 mt-2 max-w-sm">
        We couldn't find any orders matching this category. Any new customer orders will appear here automatically.
      </p>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Order Fulfilment</h2>
          <p className="text-slate-500 mt-1">Track, update, and process customer orders in real-time.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-[2rem] w-fit">
        {[
          { id: "total", label: "Total Orders", icon: Package },
          { id: "pending", label: "Pending", icon: Clock },
          { id: "completed", label: "Completed", icon: CheckCircle2 },
          { id: "cancel", label: "Cancelled", icon: XCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List / Loading State */}
      {loading ? (
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const currentStatus = order.orderStatus || order.status || "ordered";
                const isCancelled = currentStatus === "cancelled" || currentStatus === "cancel";
                const isCompletedStatus = currentStatus === "delivered";
                const isPendingStatus = currentStatus === "ordered" || currentStatus === "pending";
                
                const currentStepIndex = ORDER_STEPS.indexOf(currentStatus);

                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-8 space-y-6">
                      {/* Top Bar: Order ID, Date, Amount */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-5">
                        <div className="space-y-1.5 text-left">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                              Order ID
                            </span>
                            <button
                              onClick={() => copyToClipboard(order._id)}
                              className="flex items-center gap-1.5 text-slate-800 hover:text-primary transition-colors font-mono font-bold text-sm bg-slate-50 hover:bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-100"
                              title="Click to copy full Order ID"
                            >
                              {order._id}
                              {copiedId === order._id ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <Copy className="h-3 w-3 text-slate-400" />
                              )}
                            </button>
                            <div
                              className={`h-2 w-2 rounded-full ${
                                isCompletedStatus
                                  ? "bg-emerald-500"
                                  : isPendingStatus
                                    ? "bg-amber-500"
                                    : isCancelled
                                      ? "bg-rose-500"
                                      : "bg-primary"
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            Placed on {formatOrderDate(order.createdAt)}
                          </div>
                        </div>

                        {/* Order stats badges */}
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Total Amount
                            </p>
                            <p className="text-xl font-black text-primary">
                              ₹{(order.totalAmount || 0).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 items-start sm:items-end">
                            <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
                              Method: {order.paymentMethod || "N/A"}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
                                order.paymentStatus === "success"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : order.paymentStatus === "failed"
                                    ? "bg-rose-50 text-rose-600 border-rose-100"
                                    : "bg-amber-50 text-amber-600 border-amber-100"
                              }`}
                            >
                              Payment: {order.paymentStatus || "pending"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Main Grid: Products, Customer, Shipping Address */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* 1. Products Section */}
                        <div className="space-y-4 text-left lg:border-r lg:border-slate-50 lg:pr-8">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Products ({order.products?.length || 0})
                          </p>
                          <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
                            {order.products && order.products.length > 0 ? (
                              order.products.map((item: any, idx: number) => {
                                const product = item.product || {};
                                const productName = product.name || "Unknown Product";
                                const productPrice = item.price ?? product.sellPrice ?? 0;
                                const productQty = item.quantity ?? 1;

                                return (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-4 py-2.5 first:pt-0 last:pb-0 border-b last:border-0 border-slate-50"
                                  >
                                    <div
                                      className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center relative group/img"
                                      title="Product images are not populated in the admin orders API response."
                                    >
                                      <Package className="h-5 w-5 text-slate-300" />
                                      <div className="absolute inset-0 bg-slate-900/65 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center p-1 text-[8px] text-white font-bold text-center leading-tight">
                                        Image absent from API response
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-sm text-slate-800 truncate" title={productName}>
                                        {productName}
                                      </h4>
                                      <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-xs text-slate-500 font-medium">
                                        <span>{productQty} Unit(s)</span>
                                        <span>•</span>
                                        <span>₹{productPrice.toLocaleString()}</span>
                                        <span>•</span>
                                        <span
                                          className="text-slate-400"
                                          title="Product size details are not populated in the admin orders API response."
                                        >
                                          Size: N/A (Missing from API)
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-xs text-slate-400 italic">No products listed</p>
                            )}
                          </div>
                        </div>

                        {/* 2. Customer Section */}
                        <div className="space-y-4 text-left lg:border-r lg:border-slate-50 lg:pr-8">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Customer Details
                          </p>
                          <div className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-xs">
                            <div className="flex items-center gap-2">
                              <User className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                              <span className="font-bold text-slate-700">
                                {order.user?.name || order.contact?.name || (
                                  <span className="text-slate-400 italic">No name provided</span>
                                )}
                              </span>
                            </div>
                            <div className="text-slate-500 font-medium pl-5 break-all">
                              {order.user?.email || order.contact?.email || (
                                <span className="text-slate-400 italic">No email provided</span>
                              )}
                            </div>
                            <div className="text-slate-500 font-medium pl-5">
                              {order.user?.mobile || order.contact?.mobile || (
                                <span className="text-slate-400 italic">No phone number</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 3. Shipping Section */}
                        <div className="space-y-4 text-left">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Shipping Details
                          </p>
                          <div className="space-y-2.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-xs">
                            <div>
                              <span className="font-bold text-slate-700">
                                {order.contact?.name || "Recipient: N/A"}
                              </span>
                              {order.contact?.mobile && (
                                <span className="text-slate-500 ml-1.5 font-medium">
                                  ({order.contact.mobile})
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 font-medium leading-relaxed">
                              {order.address?.fullAddress || (
                                <span className="text-slate-400 italic">No address line</span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-slate-500 font-medium">
                              <div>
                                City: <span className="text-slate-700 font-bold">{order.address?.city || "N/A"}</span>
                              </div>
                              <div>
                                Pincode: <span className="text-slate-700 font-bold">{order.address?.pincode || "N/A"}</span>
                              </div>
                            </div>
                            <div
                              className="text-[10px] text-slate-400 font-medium mt-1 border-t border-slate-100 pt-1"
                              title="The State field is not defined in the backend Address schema."
                            >
                              State: <span className="italic">N/A (Missing from schema)</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Bottom Actions: Status management dropdown & timeline toggle */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Status:
                          </span>
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                              isCompletedStatus
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : isCancelled
                                  ? "bg-rose-50 text-rose-600 border border-rose-100"
                                  : "bg-primary/10 text-primary border border-primary/20"
                            }`}
                          >
                            {STATUS_LABELS[currentStatus] || currentStatus}
                          </span>
                        </div>

                        {/* Status Select and Details toggle */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                          <div className="w-full sm:w-48 text-left">
                            <Select
                              value={currentStatus}
                              onValueChange={(val) => handleStatusUpdate(order._id, val)}
                              disabled={statusUpdatingId === order._id}
                            >
                              <SelectTrigger className="w-full h-12 rounded-2xl border-slate-200 bg-white font-bold text-sm text-slate-700 focus:ring-primary shadow-sm hover:bg-slate-50/50 transition-colors">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                <SelectItem value="ordered" className="font-semibold text-slate-700">Ordered</SelectItem>
                                <SelectItem value="approved" className="font-semibold text-slate-700">Approved</SelectItem>
                                <SelectItem value="shipped" className="font-semibold text-slate-700">Shipped</SelectItem>
                                <SelectItem value="out_for_delivery" className="font-semibold text-slate-700">Out For Delivery</SelectItem>
                                <SelectItem value="delivered" className="font-semibold text-slate-700">Delivered</SelectItem>
                                <SelectItem value="cancelled" className="font-semibold text-rose-600">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <button
                            onClick={() =>
                              setSelectedOrderId(selectedOrderId === order._id ? null : order._id)
                            }
                            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 h-12 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                          >
                            Details
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${selectedOrderId === order._id ? "rotate-180" : ""}`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Section: Progress Timeline */}
                      <AnimatePresence>
                        {selectedOrderId === order._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-6 pt-6 border-t border-slate-50 overflow-hidden"
                          >
                            {isCancelled ? (
                              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center gap-3 text-rose-600">
                                <XCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm font-bold">This order has been cancelled and cannot be tracked further.</span>
                              </div>
                            ) : (
                              <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 md:px-8 py-6">
                                {/* Line Connector */}
                                <div className="absolute left-[14px] md:left-8 md:right-8 top-10 bottom-10 md:bottom-auto md:h-1 bg-slate-100 -z-10 w-1 md:w-auto" />
                                <div
                                  className="absolute left-[14px] md:left-8 top-10 bottom-10 md:bottom-auto md:h-1 bg-primary -z-10 w-1 md:w-auto transition-all duration-500"
                                  style={{
                                    width:
                                      typeof window !== "undefined" && window.innerWidth >= 768
                                        ? `${(Math.max(0, currentStepIndex) / (ORDER_STEPS.length - 1)) * 100}%`
                                        : "4px",
                                    height:
                                      typeof window !== "undefined" && window.innerWidth < 768
                                        ? `${(Math.max(0, currentStepIndex) / (ORDER_STEPS.length - 1)) * 100}%`
                                        : "auto",
                                  }}
                                />

                                {ORDER_STEPS.map((step, idx) => {
                                  const isCompleted = idx <= currentStepIndex;
                                  const label = STATUS_LABELS[step] || step;

                                  return (
                                    <div
                                      key={step}
                                      className="flex md:flex-col items-center gap-4 md:gap-3 flex-1 w-full md:w-auto text-left md:text-center z-10 animate-in fade-in duration-300"
                                    >
                                      <div
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                          isCompleted
                                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                            : "border-slate-200 bg-white text-slate-400"
                                        }`}
                                      >
                                        {isCompleted ? (
                                          <CheckCircle2 className="h-4 w-4 fill-white text-primary" />
                                        ) : (
                                          <span className="text-xs font-bold">{idx + 1}</span>
                                        )}
                                      </div>
                                      <div className="space-y-0.5">
                                        <p
                                          className={`text-xs font-bold ${
                                            isCompleted ? "text-slate-900" : "text-slate-400"
                                          }`}
                                        >
                                          {label}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <EmptyState />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
