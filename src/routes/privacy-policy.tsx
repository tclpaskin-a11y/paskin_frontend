import { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Lock, Database, Globe, UserCheck, Bell, Scale } from "lucide-react";

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "Privacy Policy — Paskin Medicine Supplier";
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const sections = [
    {
      title: "1. Information We Collect",
      icon: Database,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-foreground font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              1.1. Personal Information
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Full name",
                "Contact information (email, phone number, address)",
                "Payment and billing information",
                "Prescription or medical data",
                "Government-issued ID",
              ].map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-foreground font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              1.2. Non-Personal Information
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "IP address",
                "Browser type and version",
                "Device identifiers",
                "Browsing behavior",
                "Cookies and usage data",
              ].map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2. How We Use Your Information",
      icon: Eye,
      content: (
        <div className="grid gap-4">
          {[
            {
              label: "Order Fulfillment",
              desc: "Fulfill your orders and provide requested services",
            },
            { label: "Communication", desc: "Regarding orders, promotions, and updates" },
            {
              label: "Compliance",
              desc: "Ensure compliance with legal and regulatory requirements",
            },
            { label: "Improvement", desc: "Improve our website, services, and support" },
            { label: "Security", desc: "Prevent fraud and ensure security" },
            { label: "Payments", desc: "Process payments securely" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-2xl bg-white border border-border/50 shadow-sm"
            >
              <div className="font-bold text-primary whitespace-nowrap min-w-[140px]">
                {item.label}
              </div>
              <div className="text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "3. Legal Basis for Processing",
      icon: Scale,
      content: (
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
          <p className="mb-4">
            If you are in the European Economic Area (EEA), our legal basis depends on:
          </p>
          <ul className="grid sm:grid-cols-2 gap-4">
            {[
              "Your explicit consent",
              "Performance of a contract",
              "Compliance with legal obligations",
              "Legitimate interests pursued by us",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary/40" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: "4. Information Sharing",
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p>We do not sell your personal information. We may share with:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Licensed healthcare professionals",
              "Payment processors",
              "Logistics partners",
              "Government bodies",
              "IT service providers",
            ].map((item, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-medium border border-primary/10"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "5. Data Security",
      icon: Shield,
      content: (
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "SSL Encryption", desc: "Secure data transmission" },
            { label: "Secure Servers", desc: "Protected by firewalls" },
            { label: "Access Control", desc: "Strict protocol-based access" },
            { label: "Staff Training", desc: "Confidentiality agreements" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-border group hover:border-primary/30 transition-colors"
            >
              <h5 className="font-bold mb-1 text-foreground">{item.label}</h5>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "6. Data Retention",
      icon: Lock,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We retain your personal data only for as long as necessary to fulfill the purposes
          outlined in this Privacy Policy, or as required by law (e.g., for tax, accounting, or
          legal obligations).
        </p>
      ),
    },
    {
      title: "7. Your Rights",
      icon: UserCheck,
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            "Access data",
            "Correction",
            "Deletion",
            "Restriction",
            "Data portability",
            "Withdraw consent",
          ].map((item, i) => (
            <div
              key={i}
              className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              {item}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "10. Changes to Policy",
      icon: Bell,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with a new effective date.
        </p>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-primary/20">
      {/* Luxury Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] aspect-square bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-full -translate-y-1/2 blur-3xl opacity-50" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.2em]">
              <Shield className="h-3 w-3" />
              Privacy & Security
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-foreground leading-[0.9] tracking-tight">
              Privacy <span className="italic font-light text-primary">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Paskin Medicine Supplier values your privacy and is committed to protecting the
              personal information you provide to us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-12">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeIn}
                  className="relative group"
                >
                  <div className="flex flex-col lg:flex-row gap-8 items-start p-8 lg:p-12 rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-elegant transition-all duration-500">
                    <div className="lg:w-1/3 space-y-4">
                      <div className="inline-flex p-4 rounded-2xl bg-white text-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <section.icon className="h-6 w-6" />
                      </div>
                      <h2 className="font-display text-3xl font-medium text-foreground leading-tight">
                        {section.title}
                      </h2>
                    </div>
                    <div className="lg:w-2/3">{section.content}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-12">
          <div className="space-y-4">
            <h2 className="font-display text-4xl md:text-5xl">Your trust is our priority</h2>
            <p className="text-background/60 text-lg font-light leading-relaxed">
              We use industry-standard security protocols to ensure your data remains confidential
              and secure. If you have any questions about your privacy, please don't hesitate to
              reach out.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/contact"
              className="px-12 py-5 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary-glow transition shadow-xl hover:scale-105 active:scale-95"
            >
              Contact Privacy Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
