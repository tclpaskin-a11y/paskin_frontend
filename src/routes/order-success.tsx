import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ShoppingBag, Loader, AlertTriangle } from "lucide-react";
import { getUserOrder } from "@/lib/api";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Order Confirmed — PaskinCare";
  }, []);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setError("Missing order reference ID.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getUserOrder(orderId);
        if (data) {
          setOrder(data);
        } else {
          setError("Order not found.");
        }
      } catch (err: any) {
        console.error("Error loading success order:", err);
        setError(err.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="pt-48 pb-24 bg-slate-50/50 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-border/50 flex flex-col items-center max-w-md w-full text-center">
          <Loader className="h-10 w-10 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-bold text-slate-800">Loading order summary...</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Please wait while we fetch your invoice details.
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="pt-48 pb-24 bg-slate-50/50 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-border/50 flex flex-col items-center max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 animate-bounce">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Unable to load order</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {error || "We couldn't retrieve the details of your order. It may still be processing, or the session expired."}
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Link
              to="/dashboard/orders"
              className="w-full h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-sm hover:bg-primary-glow transition"
            >
              View Order History
            </Link>
            <Link
              to="/"
              className="w-full h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center font-bold text-sm hover:bg-slate-200 transition"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCod = order.paymentMethod === "COD";
  const displayId = `#PASKIN-${order._id.slice(-6).toUpperCase()}`;

  return (
    <div className="pt-36 pb-24 bg-slate-50/50 min-h-screen flex items-center justify-center animate-in fade-in duration-500">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-border/50 text-center space-y-8">
          
          {/* Checkmark Header */}
          <div className="space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
              <CheckCircle2 className="h-10 w-10 fill-primary/10 stroke-[2.5]" />
            </div>
            <h1 className="font-display text-4xl font-bold text-slate-800">
              {isCod ? "Order Placed Successfully" : "Payment Successful"}
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Thank you for shopping with PaskinCare. Your order has been registered and is now processing.
            </p>
          </div>

          {/* Order Invoice Card */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-left space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order ID</span>
              <span className="font-mono font-bold text-sm text-slate-800">{displayId}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount Paid</span>
              <span className="font-bold text-base text-primary">₹{(order.totalAmount || 0).toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Method</span>
              <span className="font-semibold text-sm text-slate-800">
                {isCod ? "Cash on Delivery (COD)" : "UPI / Razorpay"}
              </span>
            </div>

            {!isCod && order.razorpayPaymentId && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment ID</span>
                <span className="font-mono text-xs font-semibold text-slate-600 truncate max-w-[200px]" title={order.razorpayPaymentId}>
                  {order.razorpayPaymentId}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery Method</span>
              <span className="text-xs font-semibold text-slate-600">
                Standard Shipping (3-5 Days)
              </span>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-left">
            <p className="text-xs text-primary font-medium leading-relaxed">
              We have sent a receipt with tracking details to <span className="font-bold text-slate-700">{order.contact?.email || "your email"}</span>. You can track your shipment status in your dashboard.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <Link
              to={`/orders/${order._id}`}
              className="h-14 bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-sm hover:shadow-md"
            >
              Track Order
            </Link>
            <Link
              to="/"
              className="h-14 bg-primary text-white hover:bg-primary-glow rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-xl animate-pulse"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
