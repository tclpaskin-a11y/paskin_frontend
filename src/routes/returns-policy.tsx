import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  XCircle,
  CheckCircle2,
  MessageSquare,
  Package,
  CreditCard,
  Ban,
  Info,
} from "lucide-react";

export default function ReturnsPolicyPage() {
  useEffect(() => {
    document.title = "Returns Policy — Paskin Medicine Supplier";
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const sections = [
    {
      title: "1. Non-Returnable Items",
      icon: Ban,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground italic mb-4">
            Due to strict health and safety regulations, the following items are strictly
            non-returnable:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Prescription medications",
              "Opened OTC medications",
              "Temperature-sensitive products",
              "Personal care items (syringes, etc)",
              "Opened medical devices",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100/50 text-red-900/60 text-sm"
              >
                <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "2. Eligible Returns",
      icon: CheckCircle2,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">We accept returns or exchanges ONLY if:</p>
          <div className="grid gap-3">
            {[
              "Received wrong product or quantity",
              "Product was damaged during shipping",
              "Product is expired at time of delivery",
              "Received unordered items",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 text-primary font-medium text-sm"
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "3. How to Request a Return",
      icon: MessageSquare,
      content: (
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
          <p className="text-muted-foreground">Contact our support with your order details:</p>
          <div className="space-y-3">
            <a
              href="mailto:support@paskin.com"
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border hover:border-primary transition-colors group"
            >
              <div className="p-2 rounded-lg bg-slate-50 text-muted-foreground group-hover:text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-50">
                  Email Us
                </div>
                <div className="text-sm font-medium">support@paskin.com</div>
              </div>
            </a>
            <a
              href="tel:9999999999"
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border hover:border-primary transition-colors group"
            >
              <div className="p-2 rounded-lg bg-slate-50 text-muted-foreground group-hover:text-primary">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-50">
                  Call Support
                </div>
                <div className="text-sm font-medium">9999999999</div>
              </div>
            </a>
          </div>
        </div>
      ),
    },
    {
      title: "4. Return Conditions",
      icon: Info,
      content: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "State", text: "Unopened & Unused" },
            { label: "Packaging", text: "Original condition" },
            { label: "Timeline", text: "Within 7 days of approval" },
            { label: "Proof", text: "Valid receipt required" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl border border-border">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
                {item.label}
              </span>
              <p className="text-sm font-medium text-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "5. Refunds",
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">Once inspected and approved:</p>
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-60">Refund Type</span>
              <span className="font-bold">Original Payment Method</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-60">Processing Time</span>
              <span className="font-bold text-primary-glow">5–7 Business Days</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-primary/20">
      {/* Luxury Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0%,transparent_20%)] opacity-[0.03]" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em]">
              <RotateCcw className="h-3 w-3" />
              Returns & Exchanges
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-foreground leading-[0.9] tracking-tight">
              Return <span className="italic font-light text-primary">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Your satisfaction and health are our top priorities. We follow strict safety
              guidelines to ensure the integrity of our medications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-12">
                {sections.slice(0, 3).map((section, index) => (
                  <motion.div
                    key={index}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-slate-50 text-primary">
                        <section.icon className="h-6 w-6" />
                      </div>
                      <h2 className="font-display text-3xl font-medium text-foreground">
                        {section.title}
                      </h2>
                    </div>
                    <div>{section.content}</div>
                  </motion.div>
                ))}
              </div>
              <div className="lg:col-span-4 space-y-8">
                {sections.slice(3).map((section, index) => (
                  <motion.div
                    key={index}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="p-8 rounded-[32px] bg-slate-50 border border-slate-100"
                  >
                    <h3 className="font-display text-2xl font-medium text-foreground mb-6 flex items-center gap-3">
                      <section.icon className="h-5 w-5 text-primary" />
                      {section.title}
                    </h3>
                    <div>{section.content}</div>
                  </motion.div>
                ))}

                {/* Cancellation Card */}
                <div className="p-8 rounded-[32px] bg-foreground text-background">
                  <h3 className="font-display text-2xl font-medium mb-4">Cancellations</h3>
                  <p className="text-sm opacity-70 leading-relaxed mb-6">
                    Orders can only be canceled before they are shipped. Once processed, orders
                    cannot be canceled due to the nature of pharmaceutical products.
                  </p>
                  <a
                    href="/contact"
                    className="block text-center py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary-glow transition"
                  >
                    Contact to Cancel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
