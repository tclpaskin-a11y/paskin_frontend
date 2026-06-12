import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Calendar,
  ShieldCheck,
  MapPin,
  CreditCard,
  Truck,
  Loader,
  Box,
  CheckCircle2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserOrder, getReadableErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrderDetails() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getUserOrder(id);
        setOrder(data);
      } catch (error: any) {
        toast.error(getReadableErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }
    loadOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
        <ChevronLeft className="h-12 w-12 text-slate-300 mb-4 stroke-1" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Not Found</h2>
        <p className="text-slate-500 mb-6 max-w-sm">
          We couldn't retrieve the details for this order. It may not exist or you might not have
          access to it.
        </p>
        <Link
          to="/dashboard/orders"
          className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-3 font-bold transition-all shadow-lg hover:bg-primary-glow"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
  const orderStatus = order.orderStatus || "ordered";
  const displayStatus = orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1);
  const displayId = `#PASKIN-${order._id.slice(-6).toUpperCase()}`;

  // Timeline milestones
  const steps = ["ordered", "processing", "shipped", "delivered"];
  const currentStepIndex = steps.indexOf(orderStatus.toLowerCase());

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
    <div className="pt-32 pb-24 bg-slate-50/50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link
            to="/dashboard/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Order History
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 mb-8 text-left">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Order ID
                </span>
                <span className="text-xl font-bold text-slate-900">{displayId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Placed on {orderDate}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold border-2 capitalize",
                  getStatusColor(orderStatus),
                )}
              >
                {displayStatus}
              </span>
              <span
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold border-2 capitalize",
                  getStatusColor(order.paymentStatus || "pending"),
                )}
              >
                Payment: {order.paymentStatus || "pending"}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
            {/* Left Column - Products */}
            <div className="space-y-6">
              {/* Product Cards */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 space-y-6 text-left">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Box className="h-5 w-5 text-primary" />
                  Order Items
                </h3>
                <div className="space-y-4 divide-y divide-slate-100">
                  {order.products?.map((item: any, i: number) => {
                    const p = item.product || {};
                    const name = p.name || "Product Item";
                    const image =
                      p.images?.[0] ||
                      "https://images.unsplash.com/photo-1611073103901-09605d8f6cc9?auto=format&fit=crop&q=80&w=300";
                    const price = item.price || p.sellPrice || 0;
                    const qty = item.quantity || 1;

                    return (
                      <div
                        key={item._id || i}
                        className={cn("flex gap-6 items-center", i > 0 && "pt-4")}
                      >
                        <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden border border-border/50 flex-shrink-0">
                          <img src={image} className="w-full h-full object-cover" alt={name} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base text-slate-900 truncate">{name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {qty} x ₹{price.toLocaleString()}
                          </p>
                        </div>
                        <span className="font-bold text-base text-slate-900">
                          ₹{(price * qty).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Status Timeline */}
              {orderStatus.toLowerCase() !== "cancelled" && (
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 space-y-6 text-left">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    Delivery Timeline
                  </h3>
                  <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 md:px-8 py-6">
                    {/* Line Connector */}
                    <div className="absolute left-[14px] md:left-8 md:right-8 top-10 bottom-10 md:bottom-auto md:h-1 bg-slate-100 -z-10 w-1 md:w-auto" />
                    <div
                      className="absolute left-[14px] md:left-8 top-10 bottom-10 md:bottom-auto md:h-1 bg-primary -z-10 w-1 md:w-auto transition-all duration-500"
                      style={{
                        width:
                          typeof window !== "undefined" && window.innerWidth >= 768
                            ? `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`
                            : "4px",
                        height:
                          typeof window !== "undefined" && window.innerWidth < 768
                            ? `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`
                            : "auto",
                      }}
                    />

                    {steps.map((step, i) => {
                      const isCompleted = i <= currentStepIndex;
                      const isActive = i === currentStepIndex;
                      const label = step.charAt(0).toUpperCase() + step.slice(1);

                      return (
                        <div
                          key={step}
                          className="flex md:flex-col items-center gap-4 md:gap-3 flex-1 w-full md:w-auto text-left md:text-center z-10"
                        >
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                              isCompleted
                                ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                                : "border-slate-200 bg-white text-slate-400",
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 fill-white text-primary" />
                            ) : (
                              <span className="text-xs font-bold">{i + 1}</span>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <p
                              className={cn(
                                "text-sm font-bold capitalize",
                                isCompleted ? "text-slate-900" : "text-slate-400",
                              )}
                            >
                              {label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Summary & Addresses */}
            <div className="space-y-6">
              {/* Order Totals Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 space-y-6 text-left">
                <h3 className="text-xl font-bold">Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-muted-foreground text-sm font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-foreground">
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm font-medium">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="pt-4 flex justify-between text-2xl font-bold border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 space-y-6 text-left">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  Contact Info
                </h3>
                <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-sm">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                      Name
                    </span>
                    <span className="font-semibold text-slate-800">
                      {order.contact?.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                      Mobile
                    </span>
                    <span className="font-semibold text-slate-800">
                      {order.contact?.mobile || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                      Email ID
                    </span>
                    <span className="font-semibold text-slate-800 break-all">
                      {order.contact?.email || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 space-y-6 text-left">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping Address
                </h3>
                <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-sm text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                      Address
                    </span>
                    <span className="font-semibold text-slate-800 leading-relaxed">
                      {order.address?.fullAddress || order.address || "N/A"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                        City
                      </span>
                      <span className="font-semibold text-slate-800">
                        {order.address?.city || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                        Pincode
                      </span>
                      <span className="font-semibold text-slate-800">
                        {order.address?.pincode || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 space-y-6 text-left">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Details
                </h3>
                <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-sm">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                      Method
                    </span>
                    <span className="font-bold text-slate-800">
                      {order.paymentMethod === "COD" ? "Cash on Delivery" : "UPI Payment"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                      Status
                    </span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {order.paymentStatus || "pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
