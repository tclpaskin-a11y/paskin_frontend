import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Clock,
  MapPin,
  Package,
  ShieldCheck,
  Phone,
  Info,
  Globe,
  Sparkles,
} from "lucide-react";

export default function ShippingPolicyPage() {
  useEffect(() => {
    document.title = "Shipping Policy — Paskin Medicine Supplier";
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const sections = [
    {
      title: "1. Shipping Coverage",
      icon: MapPin,
      content: (
        <div className="space-y-4">
          <p>We currently ship to the following areas:</p>
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary text-primary-foreground shadow-elegant">
            <Globe className="h-5 w-5 animate-pulse" />
            <span className="font-bold tracking-tight">India Delhi NCR</span>
          </div>
          <ul className="grid gap-3 pt-2">
            {[
              "Delivery to P.O. Boxes may be limited for certain products",
              "Contact us before placing an order if your location is not listed",
            ].map((text, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground italic">
                <Info className="h-4 w-4 shrink-0 opacity-40" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: "2. Order Processing",
      icon: Clock,
      content: (
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              label: "Standard Orders",
              time: "1–2 Business Days",
              desc: "After confirmation & verification",
            },
            {
              label: "Prescription Validation",
              time: "Additional Time",
              desc: "Validation by licensed pharmacist",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-card transition-all duration-500"
            >
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
                {item.label}
              </span>
              <div className="text-xl font-display font-medium text-foreground mb-1">
                {item.time}
              </div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "3. Methods & Times",
      icon: Truck,
      content: (
        <div className="overflow-hidden rounded-[32px] border border-border bg-white shadow-sm">
          <div className="grid grid-cols-3 bg-slate-50 border-b border-border p-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <div>Method</div>
            <div>Timeline</div>
            <div>Region</div>
          </div>
          <div className="grid grid-cols-3 p-6 text-sm">
            <div className="font-bold text-foreground">Standard Shipping</div>
            <div className="text-muted-foreground">3–7 Business Days</div>
            <div className="text-muted-foreground">All Locations</div>
          </div>
        </div>
      ),
    },
    {
      title: "4. Shipping Fees",
      icon: Package,
      content: (
        <div className="flex flex-wrap gap-3">
          {["Delivery location", "Order size & weight", "Method selected"].map((item, i) => (
            <div
              key={i}
              className="px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              {item}
            </div>
          ))}
          <p className="w-full text-xs text-muted-foreground italic mt-2">
            * Calculated dynamically at checkout
          </p>
        </div>
      ),
    },
    {
      title: "6. Cold Chain Items",
      icon: ShieldCheck,
      content: (
        <div className="relative group overflow-hidden p-8 rounded-[32px] bg-blue-600 text-white shadow-elegant">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <Sparkles className="h-24 w-24" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-display text-2xl font-medium">Temperature Controlled</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Insulated packaging & cold packs",
                "Priority courier for maximum integrity",
                "Must be received upon first attempt",
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-sm font-light text-blue-50">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-300 mt-1.5" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "7. Delivery Issues",
      icon: Phone,
      content: (
        <div className="flex flex-col sm:flex-row gap-6">
          <a
            href="tel:9999999999"
            className="flex-1 p-8 rounded-[32px] bg-foreground text-background group hover:bg-primary transition-colors duration-500 shadow-xl"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-2">
              Priority Support
            </div>
            <div className="text-3xl font-display font-medium mb-4">9999999999</div>
            <div className="text-sm opacity-70">
              Immediate assistance for delayed or damaged packages.
            </div>
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-primary/20">
      {/* Luxurious Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-primary/5 blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-primary/5 blur-[120px] animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-border shadow-sm text-primary text-[10px] font-bold uppercase tracking-[0.3em] animate-fade-in">
              <Truck className="h-3 w-3" />
              Global Logistics
            </div>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-medium text-foreground leading-[0.85] tracking-tight">
              Swift <br />
              <span className="italic font-light text-primary">Delivery</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
              At Paskin, we understand the urgency of healthcare. Our logistics network is
              engineered for safety, security, and precision timing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-x-12 gap-y-24">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-border" />
                  <div className="p-2 text-primary">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-4xl font-medium whitespace-nowrap">
                    {section.title}
                  </h2>
                </div>
                <div className="pl-12">{section.content}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center max-w-3xl space-y-12">
          <h2 className="font-display text-5xl md:text-6xl font-medium leading-tight">
            Seamless tracking <br /> at your fingertips
          </h2>
          <p className="text-xl text-muted-foreground font-light">
            Monitor your medical shipments in real-time. Enter your tracking number below or visit
            our tracking portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="text"
              placeholder="Enter Tracking Number"
              className="px-8 py-5 rounded-full bg-white border border-border focus:outline-none focus:border-primary min-w-[300px] shadow-sm"
            />
            <button className="px-10 py-5 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary-glow transition shadow-xl hover:scale-105 active:scale-95">
              Track Order
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
