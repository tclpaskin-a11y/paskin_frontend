import { useState, useEffect } from "react";
import { Building2, Mail, Phone, MapPin, Send, CheckCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PartnerPage() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Partner With Us — PASKIN Pharmaceutical Distribution";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-elegant text-center animate-fade-in">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Application Received</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for your interest in partnering with PASKIN. Our team will review your details and contact you within 48 hours.
          </p>
          <Button onClick={() => setSubmitted(false)} className="rounded-full px-8">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-foreground text-background">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-medium mb-6">
            Partner With Us
          </h1>
          <p className="text-xl text-background/60 max-w-2xl mx-auto leading-relaxed">
            Expand your healthcare business with PASKIN. We provide premium pharmaceutical products and reliable distribution support worldwide.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_500px] gap-20">
            {/* Info */}
            <div className="space-y-12">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-slate-50 border border-border/50">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-6">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">B2B Solutions</h3>
                  <p className="text-sm text-muted-foreground">Customized supply chain solutions for hospitals, clinics, and pharmacies.</p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-50 border border-border/50">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-6">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Global Distribution</h3>
                  <p className="text-sm text-muted-foreground">Logistics support for import and export across 10+ countries.</p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold">Contact Our Support</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>Paskin.info@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>+91 9582824383</span>
                  </div>

                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl border border-border shadow-elegant p-10">
              <h3 className="text-2xl font-bold mb-8">Business Inquiry</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:border-primary focus:outline-none" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Company Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:border-primary focus:outline-none" placeholder="Your business name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email</label>
                    <input required type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:border-primary focus:outline-none" placeholder="Email address" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Phone</label>
                    <input required type="tel" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:border-primary focus:outline-none" placeholder="Phone number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Business Type</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:border-primary focus:outline-none">
                    <option>Pharmacy/Retail</option>
                    <option>Hospital/Healthcare</option>
                    <option>Distributor/Wholesaler</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:border-primary focus:outline-none" placeholder="Describe your business needs"></textarea>
                </div>
                <Button type="submit" className="w-full h-14 rounded-xl gap-2 font-bold text-lg">
                  <Send className="h-5 w-5" />
                  Submit Inquiry
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
