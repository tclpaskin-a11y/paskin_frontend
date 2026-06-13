import { apiCall } from "./client";
import { toast } from "sonner";

export interface RazorpayOrderRequest {
  amount: number; // in paise
  currency: string;
  receipt: string;
}

export interface RazorpayOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
}

export interface RazorpayVerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerificationResponse {
  success: boolean;
  message?: string;
}

export interface RazorpayPaymentData {
  amount: number; // in rupees
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

let isScriptLoaded = false;

/**
 * Dynamically loads the Razorpay checkout script if it is not already loaded.
 * Returns true if successful, otherwise false.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (isScriptLoaded || (window as any).Razorpay) {
      isScriptLoaded = true;
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        isScriptLoaded = true;
        resolve(true);
      });
      existingScript.addEventListener("error", () => {
        resolve(false);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      isScriptLoaded = true;
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Calls the backend API to create a Razorpay order.
 */
export async function createRazorpayOrder(
  data: RazorpayOrderRequest,
): Promise<RazorpayOrderResponse> {
  return apiCall<RazorpayOrderResponse>("/create-order", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Calls the backend API to verify a Razorpay payment signature.
 */
export async function verifyRazorpayPayment(
  data: RazorpayVerificationRequest,
): Promise<RazorpayVerificationResponse> {
  return apiCall<RazorpayVerificationResponse>("/verify-payment", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Main orchestrator to load the script, request order creation, open the Razorpay checkout modal,
 * and verify the signature upon payment completion.
 * Resolves to the payment/verification payload if successful, or null on cancellation/failure.
 */
export function handleRazorpayPayment(
  paymentData: RazorpayPaymentData,
  onStatusChange?: (status: "initiating" | "active" | "verifying") => void,
): Promise<{
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
} | null> {
  return new Promise(async (resolve) => {
    try {
      onStatusChange?.("initiating");

      // 1. Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error(
          "Failed to load Razorpay payment gateway. Please check your internet connection.",
        );
        resolve(null);
        return;
      }

      // 2. Create Razorpay order on backend
      const amountInPaise = Math.round(paymentData.amount * 100);
      const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const order = await createRazorpayOrder({
        amount: amountInPaise,
        currency: "INR",
        receipt,
      });

      if (!order || !order.order_id) {
        toast.error("Failed to initiate payment. Please try again.");
        resolve(null);
        return;
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("VITE_RAZORPAY_KEY_ID is missing");
      }

      // 3. Configure Razorpay options
      const isMobile = typeof window !== "undefined" && window.innerWidth < 480;

      const options = {
        key: razorpayKey,
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency,
        name: "PaskinCare",
        description: "Order Payment",
        prefill: {
          name: paymentData.prefill.name,
          email: paymentData.prefill.email,
          contact: paymentData.prefill.contact,
        },
        theme: {
          color: "#2E7D32", // PASKIN Brand Primary Green
        },
        handler: async function (response: any) {
          // Restore page scroll
          document.body.style.overflow = "";
          try {
            console.log("STEP 1: PAYMENT SUCCESS");
            console.log("STEP 2: VERIFY PAYMENT");
            onStatusChange?.("verifying");
            // STEP 4: PAYMENT SUCCESS & VERIFICATION
            const verifyResponse = await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log("STEP 3: VERIFY RESPONSE", verifyResponse);

            if (verifyResponse && verifyResponse.success !== false) {
              toast.success("Payment verified successfully!");
              resolve({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
            } else {
              toast.error(verifyResponse.message || "Payment verification failed.");
              resolve(null);
            }
          } catch (error: any) {
            console.error("Verification error:", error);
            toast.error(error.message || "Payment verification failed. Please contact support.");
            resolve(null);
          }
        },
        modal: {
          backdropclose: !isMobile, // Prevents closing on backdrop click for mobile to avoid accidental cancellation
          escape: true,
          ondismiss: function () {
            // Restore page scroll
            document.body.style.overflow = "";
            // STEP 6: USER CANCELLED PAYMENT
            toast.info("Payment cancelled by user.");
            resolve(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      // STEP 5: PAYMENT FAILED
      rzp.on("payment.failed", function (response: any) {
        console.error("Razorpay Payment Failed:", {
          code: response.error.code,
          description: response.error.description,
          source: response.error.source,
          reason: response.error.reason,
        });
        toast.error("Payment Failed. Please try again.");
        // Restore page scroll
        document.body.style.overflow = "";
        resolve(null);
      });

      // Prevent page scrolling while Razorpay modal is open
      document.body.style.overflow = "hidden";
      rzp.open();
      onStatusChange?.("active");
    } catch (error: any) {
      console.error("Razorpay setup error:", error);
      toast.error(error.message || "Failed to initialize payment process.");
      // Restore page scroll in case it was set
      document.body.style.overflow = "";
      resolve(null);
    }
  });
}
