import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  MapPin,
  Building,
  CreditCard as CardIcon,
  CheckCircle2,
  PackageCheck,
  Loader,
  User,
  X,
  Edit2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  getUserAddresses,
  addAddress,
  createOrder,
  updateUserProfile,
  updateAddress,
  handleRazorpayPayment,
  loadRazorpayScript,
  getReadableErrorMessage,
  resolveOrder,
} from "@/lib/api";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loadingState, setLoadingState] = useState<string>("");
  const [createdOrderDetails, setCreatedOrderDetails] = useState<{
    id: string;
    amount: number;
    paymentId: string;
    paymentMethod: string;
  } | null>(null);
  const [recoveryDetails, setRecoveryDetails] = useState<{
    paymentId: string;
    orderId: string;
    signature: string;
    amount: number;
    contact: {
      name: string;
      mobile: string;
      email: string;
    };
    addressId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      name: string;
    }>;
  } | null>(null);

  // Personal details states
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  // Address and payment states
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI">("COD");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullAddress: "",
    city: "",
    pincode: "",
    country: "India",
  });

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const data = await getUserAddresses();
      setAddresses(data);
      if (data.length > 0) {
        setSelectedAddressId(data[0]._id);
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    document.title = "Checkout — PaskinCare";
    fetchAddresses();
    loadRazorpayScript().catch((err) => console.error("Error preloading Razorpay:", err));

    // Check for pending payment recovery on load
    const savedRecovery = localStorage.getItem("paskin_payment_recovery");
    if (savedRecovery) {
      try {
        setRecoveryDetails(JSON.parse(savedRecovery));
      } catch (e) {
        localStorage.removeItem("paskin_payment_recovery");
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Listen for ESC key to close/redirect success modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && orderSuccess && createdOrderDetails) {
        navigate(`/order-success?orderId=${createdOrderDetails.id}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [orderSuccess, createdOrderDetails, navigate]);

  const handleSaveAddress = async () => {
    if (!addressForm.fullAddress) {
      toast.error("Please enter your full address.");
      return;
    }
    if (!addressForm.city) {
      toast.error("Please enter your city.");
      return;
    }
    if (!addressForm.pincode) {
      toast.error("Please enter your pincode.");
      return;
    }

    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, addressForm);
        toast.success("Address updated successfully!");
      } else {
        const newAddr = await addAddress(addressForm);
        toast.success("Address added successfully!");
        if (newAddr && newAddr._id) {
          setSelectedAddressId(newAddr._id);
        }
      }
      setIsAddAddressOpen(false);
      setAddressForm({
        fullAddress: "",
        city: "",
        pincode: "",
        country: "India",
      });
      setEditingAddress(null);
      await fetchAddresses();
    } catch (err: any) {
      toast.error(getReadableErrorMessage(err));
    }
  };

  const handlePlaceOrder = async () => {
    if (isProcessingPayment) return; // Prevent duplicate clicks

    if (!personalDetails.name) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!personalDetails.mobile) {
      toast.error("Please enter your contact number.");
      return;
    }
    if (!personalDetails.email) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }

    // Validate every cart item before opening Razorpay/placing order
    for (const item of items) {
      if (item.isPaused) {
        toast.error(`"${item.name}" is no longer available. Please remove it from your cart.`);
        return;
      }
      const stock = item.stock !== undefined ? item.stock : 99;
      if (stock <= 0) {
        toast.error(`"${item.name}" is out of stock. Please remove it from your cart.`);
        return;
      }
      if (stock < item.quantity) {
        toast.error(`"${item.name}" has insufficient stock. Only ${stock} units are available.`);
        return;
      }
    }

    try {
      setIsProcessingPayment(true);

      let createdOrder: any = null;

      if (paymentMethod === "UPI") {
        setLoadingState("Connecting to Payment Gateway...");
        const paymentResult = await handleRazorpayPayment(
          {
            amount: totalPrice,
            prefill: {
              name: personalDetails.name,
              email: personalDetails.email,
              contact: personalDetails.mobile,
            },
          },
          (status) => {
            if (status === "initiating") {
              setLoadingState("Connecting to Payment Gateway...");
            } else if (status === "active") {
              setLoadingState(""); // Hide full-page spinner during active transaction input
            } else if (status === "verifying") {
              setLoadingState("Verifying Payment...");
            }
          }
        );

        if (!paymentResult) {
          setIsProcessingPayment(false);
          setLoadingState("");
          return;
        }

        try {
          setLoadingState("Creating Order...");
          createdOrder = await createOrder({
            contact: {
              name: personalDetails.name,
              mobile: personalDetails.mobile,
              email: personalDetails.email,
            },
            addressId: selectedAddressId,
            paymentMethod: "UPI",
            razorpayPaymentId: paymentResult.razorpay_payment_id,
            razorpayOrderId: paymentResult.razorpay_order_id,
            razorpaySignature: paymentResult.razorpay_signature,
          });

          const resolved = resolveOrder(createdOrder);
          setCreatedOrderDetails({
            id: resolved?._id || resolved?.id || "",
            amount: totalPrice,
            paymentId: paymentResult.razorpay_payment_id,
            paymentMethod: "UPI",
          });
        } catch (orderError: any) {
          console.error("Order creation failed after payment success:", orderError);
          const recoveryData = {
            paymentId: paymentResult.razorpay_payment_id,
            orderId: paymentResult.razorpay_order_id,
            signature: paymentResult.razorpay_signature,
            amount: totalPrice,
            contact: {
              name: personalDetails.name,
              mobile: personalDetails.mobile,
              email: personalDetails.email,
            },
            addressId: selectedAddressId,
            items: items.map(item => ({
              productId: item.id || (item as any).productId,
              quantity: item.quantity,
              price: item.price,
              name: item.name
            }))
          };
          localStorage.setItem("paskin_payment_recovery", JSON.stringify(recoveryData));
          setRecoveryDetails(recoveryData);
          setIsProcessingPayment(false);
          setLoadingState("");
          toast.error("Payment received but order creation failed. Our team has been notified.");
          return;
        }
      } else {
        setLoadingState("Creating Order...");
        createdOrder = await createOrder({
          contact: {
            name: personalDetails.name,
            mobile: personalDetails.mobile,
            email: personalDetails.email,
          },
          addressId: selectedAddressId,
          paymentMethod: "COD",
        });

        const resolved = resolveOrder(createdOrder);
        setCreatedOrderDetails({
          id: resolved?._id || resolved?.id || "",
          amount: totalPrice,
          paymentId: "N/A (Cash on Delivery)",
          paymentMethod: "COD",
        });
      }

      // Show success modal immediately
      setOrderSuccess(true);

      // Attempt backend cart cleanup safely
      try {
        await clearCart(true); // Clear cart items silently
      } catch (cartClearError) {
        console.warn("Non-blocking backend cart cleanup failed:", cartClearError);
      }
    } catch (error: any) {
      toast.error(getReadableErrorMessage(error));
    } finally {
      setIsProcessingPayment(false);
      setLoadingState("");
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="pt-48 pb-24 bg-white min-h-screen text-center">
        <div className="max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageCheck className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Your bag is empty</h2>
          <p className="text-muted-foreground mb-8">
            Add some products to your bag before checking out.
          </p>
          <Link
            to="/"
            className="inline-flex h-14 items-center justify-center px-8 bg-primary text-white rounded-2xl font-bold hover:bg-primary-glow transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-slate-50/50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h1 className="font-display text-4xl font-bold">Checkout</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Secure Checkout
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
            <div className="space-y-6">
              {/* Personal Details */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 space-y-6 text-left">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  Personal Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <div className="text-left space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={personalDetails.name}
                      onChange={(e) =>
                        setPersonalDetails({ ...personalDetails, name: e.target.value })
                      }
                      className="w-full bg-white rounded-xl h-12 px-4 border border-slate-200 focus:border-primary focus:outline-none text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="text-left space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Contact Number *
                    </label>
                    <input
                      type="text"
                      placeholder="Contact Number"
                      value={personalDetails.mobile}
                      onChange={(e) =>
                        setPersonalDetails({ ...personalDetails, mobile: e.target.value })
                      }
                      className="w-full bg-white rounded-xl h-12 px-4 border border-slate-200 focus:border-primary focus:outline-none text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="text-left space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Email ID *
                    </label>
                    <input
                      type="email"
                      placeholder="Email ID"
                      value={personalDetails.email}
                      onChange={(e) =>
                        setPersonalDetails({ ...personalDetails, email: e.target.value })
                      }
                      className="w-full bg-white rounded-xl h-12 px-4 border border-slate-200 focus:border-primary focus:outline-none text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 space-y-6 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    Shipping Address
                  </h3>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressForm({
                        fullAddress: "",
                        city: "",
                        pincode: "",
                        country: "India",
                      });
                      setIsAddAddressOpen(true);
                    }}
                    className="text-xs font-bold text-primary hover:text-primary-glow flex items-center gap-1 bg-primary/5 hover:bg-primary/10 px-3.5 py-2 rounded-full transition-all"
                  >
                    + Add New Address
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="animate-spin text-primary h-6 w-6" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center">
                    <MapPin className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No saved addresses found.
                    </p>
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setAddressForm({
                          fullAddress: "",
                          city: "",
                          pincode: "",
                          country: "India",
                        });
                        setIsAddAddressOpen(true);
                      }}
                      className="mt-4 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-glow transition"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => !isProcessingPayment && setSelectedAddressId(addr._id)}
                        className={cn(
                          "p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-full relative group pr-14",
                          selectedAddressId === addr._id
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                            : "border-slate-100 bg-white hover:border-slate-200",
                        )}
                      >
                        <div className="space-y-3 text-left">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                              Address
                            </p>
                            <p className="font-semibold text-slate-800 text-sm leading-relaxed">
                              {addr.fullAddress}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                City
                              </p>
                              <p className="text-xs font-medium text-slate-700">{addr.city}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                Pincode
                              </p>
                              <p className="text-xs font-medium text-slate-700">{addr.pincode}</p>
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                              selectedAddressId === addr._id
                                ? "border-primary bg-primary text-white"
                                : "border-slate-200 bg-white",
                            )}
                          >
                            {selectedAddressId === addr._id && (
                              <CheckCircle2 className="h-3.5 w-3.5 fill-white text-primary" />
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAddress(addr);
                              setAddressForm({
                                fullAddress: addr.fullAddress,
                                city: addr.city,
                                pincode: addr.pincode,
                                country: addr.country || "India",
                              });
                              setIsAddAddressOpen(true);
                            }}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-800 hover:text-primary transition-all"
                            title="Edit Address"
                          >
                            <Edit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 space-y-6 text-left">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <CardIcon className="h-5 w-5 text-primary" />
                  Payment Method
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* COD Option */}
                  <div
                    onClick={() => !isProcessingPayment && setPaymentMethod("COD")}
                    className={cn(
                      "p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all",
                      paymentMethod === "COD"
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                        : "border-slate-100 bg-white hover:border-slate-200",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          paymentMethod === "COD"
                            ? "bg-white shadow-sm text-primary"
                            : "bg-slate-50 text-slate-600",
                        )}
                      >
                        <Truck className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-sm block">Cash on Delivery (COD)</span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Pay upon delivery
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                        paymentMethod === "COD"
                          ? "border-primary bg-primary text-white"
                          : "border-slate-200 bg-white",
                      )}
                    >
                      {paymentMethod === "COD" && (
                        <CheckCircle2 className="h-3.5 w-3.5 fill-white text-primary" />
                      )}
                    </div>
                  </div>

                  {/* UPI Option */}
                  <div
                    onClick={() => !isProcessingPayment && setPaymentMethod("UPI")}
                    className={cn(
                      "p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all",
                      paymentMethod === "UPI"
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                        : "border-slate-100 bg-white hover:border-slate-200",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          paymentMethod === "UPI"
                            ? "bg-white shadow-sm text-primary"
                            : "bg-slate-50 text-slate-600",
                        )}
                      >
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-sm block">Pay via UPI</span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          GPay, PhonePe, Paytm
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                        paymentMethod === "UPI"
                          ? "border-primary bg-primary text-white"
                          : "border-slate-200 bg-white",
                      )}
                    >
                      {paymentMethod === "UPI" && (
                        <CheckCircle2 className="h-3.5 w-3.5 fill-white text-primary" />
                      )}
                    </div>
                  </div>
                </div>

                {paymentMethod === "UPI" && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left animate-in fade-in duration-300">
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      Pay instantly and securely using Razorpay (UPI, Card, Net Banking, or Wallet).
                      The payment window will open when you click Place Order.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessingPayment}
                  className="w-full h-16 rounded-2xl text-lg font-bold mt-4 bg-primary hover:bg-primary-glow shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-6 lg:sticky lg:top-32">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 space-y-6">
                <h3 className="text-xl font-bold">Order Summary</h3>

                <div className="space-y-4 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden border border-border/50 flex-shrink-0">
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                          alt={item.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} x ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <span className="font-bold text-sm">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-slate-100" />

                <div className="space-y-4">
                  <div className="flex justify-between text-muted-foreground text-sm font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-foreground">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm font-medium">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="pt-4 flex justify-between text-2xl font-bold border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 flex items-center gap-3 border border-slate-100">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Secure SSL encrypted payment
                  </span>
                </div>
              </div>

              <div className="bg-primary/5 rounded-2xl p-6 flex items-center gap-4 border border-primary/10">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                    Standard Shipping
                  </p>
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                    Expected delivery:{" "}
                    <span className="font-bold text-foreground">3-5 business days</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {orderSuccess && createdOrderDetails && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => navigate(`/order-success?orderId=${createdOrderDetails.id}`)}
          />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
            {/* Close Button */}
            <button
              onClick={() => navigate(`/order-success?orderId=${createdOrderDetails.id}`)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Check Icon */}
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary animate-bounce">
              <CheckCircle2 className="h-12 w-12 fill-primary/10 stroke-[2.5]" />
            </div>

            {/* Header */}
            <h2 id="success-modal-title" className="font-display text-3xl font-bold mb-2 text-slate-800">✓ Order Confirmed</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto leading-relaxed">
              Thank you for your purchase.
            </p>

            {/* Details Box */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-3.5 border border-slate-100 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-800">
                  #PASKIN-{createdOrderDetails.id ? createdOrderDetails.id.slice(-6).toUpperCase() : "N/A"}
                </span>
              </div>
              {createdOrderDetails.paymentMethod !== "COD" && createdOrderDetails.paymentId && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-500">Payment ID:</span>
                  <span className="font-mono font-bold text-slate-800 text-xs truncate max-w-[200px]" title={createdOrderDetails.paymentId}>
                    {createdOrderDetails.paymentId}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Payment Status:</span>
                <span className="font-bold text-emerald-600">
                  {createdOrderDetails.paymentMethod === "COD" ? "Pending (Cash on Delivery)" : "Paid Successfully"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Estimated Delivery:</span>
                <span className="font-semibold text-slate-700">3-5 Business Days</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Link
                to={`/orders/${createdOrderDetails.id}`}
                className="w-full h-14 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl flex items-center justify-center font-bold text-base transition-all shadow-sm hover:shadow-md"
              >
                Track Order
              </Link>
              <button
                onClick={() => navigate(`/order-success?orderId=${createdOrderDetails.id}`)}
                className="w-full h-14 bg-primary text-white hover:bg-primary-glow rounded-2xl flex items-center justify-center font-bold text-base transition-all shadow-xl shadow-primary/20 hover:shadow-2xl"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Loading Overlay */}
      {isProcessingPayment && loadingState && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center max-w-xs w-full shadow-2xl text-center border border-slate-100">
            <Loader className="animate-spin text-primary h-12 w-12 mb-6" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">{loadingState}</h3>
            <p className="text-xs text-muted-foreground">
              Please do not close this window or refresh the page.
            </p>
          </div>
        </div>
      )}

      {/* Add Address Popup Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setIsAddAddressOpen(false);
              setAddressForm({
                fullAddress: "",
                city: "",
                pincode: "",
                country: "India",
              });
              setEditingAddress(null);
            }}
          />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
            <button
              onClick={() => {
                setIsAddAddressOpen(false);
                setAddressForm({
                  fullAddress: "",
                  city: "",
                  pincode: "",
                  country: "India",
                });
                setEditingAddress(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {editingAddress
                  ? "Update your shipping details."
                  : "Please fill in your shipping details."}
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Full Address *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123 Street, Area"
                  value={addressForm.fullAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, fullAddress: e.target.value })}
                  className="w-full rounded-2xl h-14 px-4 border border-slate-200 focus:border-primary focus:ring-primary/20 focus:outline-none bg-slate-50/50 text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="Delhi"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full rounded-2xl h-14 px-4 border border-slate-200 focus:border-primary focus:ring-primary/20 focus:outline-none bg-slate-50/50 text-slate-800"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    placeholder="110001"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full rounded-2xl h-14 px-4 border border-slate-200 focus:border-primary focus:ring-primary/20 focus:outline-none bg-slate-50/50 text-slate-800"
                  />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="India"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="w-full rounded-2xl h-14 px-4 border border-slate-200 focus:border-primary focus:ring-primary/20 focus:outline-none bg-slate-50/50 text-slate-800"
                />
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={handleSaveAddress}
                  className="w-full h-14 rounded-2xl text-base font-bold bg-primary hover:bg-primary-glow shadow-lg shadow-primary/20"
                >
                  Save Address
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsAddAddressOpen(false);
                    setAddressForm({
                      fullAddress: "",
                      city: "",
                      pincode: "",
                      country: "India",
                    });
                    setEditingAddress(null);
                  }}
                  className="w-full h-14 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-slate-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Recovery Modal */}
      {recoveryDetails && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recovery-modal-title"
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {}} // Block dismissal on backdrop click to ensure they read it
          />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 sm:p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300 border border-amber-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Warning Icon */}
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
              <AlertTriangle className="h-10 w-10 stroke-[2.5]" />
            </div>

            {/* Header */}
            <h2 id="recovery-modal-title" className="font-display text-2xl font-bold mb-2 text-slate-800">Action Required: Payment Recovery</h2>
            <p className="text-xs text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
              Your payment was successful, but we encountered an error creating your order in our database. Please save these details to complete manual setup.
            </p>

            {/* Details Box */}
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-3 border border-slate-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Payment ID:</span>
                <span className="font-mono font-bold text-slate-800 text-xs truncate max-w-[220px]" id="recovery-payment-id">
                  {recoveryDetails.paymentId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Razorpay Order ID:</span>
                <span className="font-mono font-bold text-slate-800 text-xs truncate max-w-[220px]">
                  {recoveryDetails.orderId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Amount Paid:</span>
                <span className="font-bold text-amber-700">
                  ₹{recoveryDetails.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Customer Name:</span>
                <span className="font-semibold text-slate-700">{recoveryDetails.contact.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Mobile:</span>
                <span className="font-semibold text-slate-700">{recoveryDetails.contact.mobile}</span>
              </div>
            </div>

            {/* Items Box */}
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-2 border border-slate-100 text-xs max-h-[150px] overflow-y-auto">
              <p className="font-bold text-slate-600 mb-2 uppercase tracking-wider text-[10px]">Cart Items to Recover</p>
              {recoveryDetails.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-slate-700 font-medium">
                  <span className="truncate max-w-[200px]">{item.name}</span>
                  <span>{item.quantity} x ₹{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Warning Message */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-left mb-6">
              <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                <strong>Notice:</strong> Please share the Payment ID above with support to have an administrator manually create your order in the system. Do not pay again.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  const text = `PaskinCare Payment Recovery Details:\nPayment ID: ${recoveryDetails.paymentId}\nRazorpay Order ID: ${recoveryDetails.orderId}\nAmount: ₹${recoveryDetails.amount}\nName: ${recoveryDetails.contact.name}\nPhone: ${recoveryDetails.contact.mobile}`;
                  navigator.clipboard.writeText(text);
                  toast.success("Recovery details copied to clipboard!");
                }}
                className="flex-1 h-12 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-sm transition-all"
              >
                Copy Reference Info
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("paskin_payment_recovery");
                  setRecoveryDetails(null);
                  toast.info("Recovery payload dismissed.");
                }}
                className="flex-1 h-12 bg-amber-600 text-white hover:bg-amber-700 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-md shadow-amber-600/10"
              >
                I have contacted support
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
