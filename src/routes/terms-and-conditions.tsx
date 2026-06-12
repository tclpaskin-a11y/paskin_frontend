import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Truck,
  RefreshCcw,
  ShieldAlert,
  Gavel,
  Lock,
  Info,
  UserCheck,
} from "lucide-react";

export default function TermsConditionsPage() {
  useEffect(() => {
    document.title = "Terms & Conditions — Paskin Medicine Supplier";
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: CheckCircle,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          By accessing, purchasing from, or otherwise using the services of Paskin Medicine
          Supplier, the customer agrees to be bound by the following Terms and Conditions. If you do
          not agree to these terms, please do not proceed with any transaction.
        </p>
      ),
    },
    {
      title: "2. Eligibility",
      icon: UserCheck,
      content: (
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
          <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
          <p className="text-amber-900/80 text-sm leading-relaxed">
            You must be at least <span className="font-bold">18 years of age</span> and legally
            authorized to purchase pharmaceutical products in your country or region. Orders will
            only be processed upon verification of all applicable licenses.
          </p>
        </div>
      ),
    },
    {
      title: "3. Product Availability",
      icon: Info,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          All products listed are subject to availability. We reserve the right to substitute,
          discontinue, or limit the quantities of any products at any time without prior notice.
        </p>
      ),
    },
    {
      title: "4. Pricing & Payment",
      icon: CreditCard,
      content: (
        <ul className="space-y-4">
          {[
            "Prices are subject to change without prior notice.",
            "All prices are exclusive of applicable taxes, shipping, and handling charges unless otherwise stated.",
            "Full payment is required before dispatch unless prior credit arrangements have been made in writing.",
          ].map((text, i) => (
            <li key={i} className="flex gap-3 text-muted-foreground">
              <span className="text-primary font-bold">{i + 1}.</span>
              {text}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "5. Orders & Delivery",
      icon: Truck,
      content: (
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Placement", text: "Via email, phone, or authorized channels." },
            { label: "Timelines", text: "Estimates only; not guaranteed." },
            { label: "Risk", text: "Passes to you upon delivery." },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl border border-border">
              <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-1">
                {item.label}
              </span>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "6. Returns & Refunds",
      icon: RefreshCcw,
      content: (
        <div className="space-y-4 text-muted-foreground">
          <p>
            Returns accepted for damaged or incorrect products reported within{" "}
            <span className="text-foreground font-medium">3 working days</span>.
          </p>
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-900/70 text-sm italic">
            No returns for temperature-sensitive, opened, or prescription-only medications unless
            faulty.
          </div>
        </div>
      ),
    },
    {
      title: "8. Warranties & Liability",
      icon: ShieldAlert,
      content: (
        <p className="text-muted-foreground leading-relaxed italic">
          "Our liability is strictly limited to the purchase price of the products supplied. We are
          not liable for any indirect, incidental, or consequential damages."
        </p>
      ),
    },
    {
      title: "11. Governing Law",
      icon: Gavel,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          These Terms and Conditions shall be governed by and interpreted in accordance with the
          laws of <span className="text-foreground font-medium">India</span>. Any disputes arising
          shall be subject to the exclusive jurisdiction of the courts of{" "}
          <span className="text-foreground font-medium">New Delhi</span>.
        </p>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-primary/20">
      {/* Luxury Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[100%] aspect-square bg-gradient-to-l from-primary/5 via-transparent to-transparent rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl opacity-50" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-[0.2em]">
              <FileText className="h-3 w-3" />
              Legal Agreement
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-foreground leading-[0.9] tracking-tight">
              Terms & <span className="italic font-light text-primary">Conditions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Ensuring transparency and trust in every transaction. Please read these terms
              carefully before engaging with our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeIn}
                  className="flex flex-col p-8 rounded-[32px] bg-white border border-border hover:border-primary/20 hover:shadow-card transition-all duration-500 group"
                >
                  <div className="inline-flex p-3 rounded-xl bg-slate-50 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500 w-fit">
                    <section.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-4">{section.title}</h2>
                  <div className="flex-1">{section.content}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Governing Law CTA */}
      <section className="py-24 bg-slate-50 border-y border-border">
        <div className="container mx-auto px-6 text-center max-w-3xl space-y-8">
          <Gavel className="h-12 w-12 text-primary mx-auto opacity-20" />
          <h2 className="font-display text-4xl font-medium">Compliance & Ethics</h2>
          <p className="text-muted-foreground leading-relaxed">
            Paskin Medicine Supplier operates under strict regulatory guidelines to ensure the
            safety and efficacy of all pharmaceutical products. By continuing, you acknowledge our
            commitment to these standards.
          </p>
          <button className="px-12 py-5 rounded-full bg-foreground text-background font-bold hover:bg-foreground/90 transition shadow-xl">
            Download PDF Version
          </button>
        </div>
      </section>
    </div>
  );
}
