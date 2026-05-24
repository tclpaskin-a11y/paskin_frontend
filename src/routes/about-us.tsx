import { ShieldCheck, Truck, RotateCcw, Globe, Award, Sparkles } from "lucide-react";
import aboutHero from "@/assets/about-hero-new.png";
import { useEffect } from "react";

export default function AboutUsPage() {
  useEffect(() => {
    document.title = "Our Heritage — PaskinCare Premium Pharmaceutical";
  }, []);

  return (
    <div className="bg-white min-h-screen selection:bg-primary/20">
      {/* Luxury Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={aboutHero} 
            alt="PaskinCare Heritage" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-[0.3em] animate-fade-in-up">
              <Sparkles className="h-3 w-3 text-primary-glow" />
              Est. 2024
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-medium text-white leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Redefining <br className="hidden sm:block" />
              <span className="italic font-light">Global Care</span>
            </h1>
            <p className="text-xl text-white/70 max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              PaskinCare stands as a beacon of excellence in pharmaceutical trading, bridging the gap between innovative science and worldwide accessibility.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-px h-12 bg-white" />
        </div>
      </section>

      {/* Visionary Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
               <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm">Our Vision</span>
               <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground leading-tight">
                To become the most <span className="text-primary italic">trusted choice</span> in global pharmaceutical logistics.
               </h2>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              Welcome to PaskinCare, a leading pharmaceutical trading company that specializes in connecting the world's healthcare providers with top-quality medicines and innovative healthcare solutions. With an unwavering commitment to excellence, we strive to be your trusted partner in the global pharmaceutical trade.
            </p>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
               <h3 className="font-display text-4xl font-bold">Unwavering Integrity</h3>
               <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>
                   At Paskin, we understand the critical role that pharmaceuticals play in improving and saving lives. That's why we diligently source and supply a comprehensive range of high-quality medicines, ensuring access to safe and effective treatments for a wide array of medical conditions.
                </p>
                <p>
                   Our dedicated team of experts works tirelessly to maintain strong relationships with trusted manufacturers, ensuring that we offer an extensive portfolio of pharmaceutical products that meet the highest quality standards.
                </p>
               </div>
               <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="space-y-2">
                    <span className="text-4xl font-display font-bold text-primary">10+</span>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">Countries Served</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-4xl font-display font-bold text-primary">100%</span>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">Quality Compliance</p>
                  </div>
               </div>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl">
                <img src={aboutHero} className="w-full h-full object-cover grayscale-[0.2]" alt="Scientific Excellence" />
              </div>
              <div className="absolute -bottom-12 -left-12 bg-foreground text-background p-12 rounded-3xl max-w-xs shadow-2xl">
                 <p className="text-xl font-display italic leading-relaxed">
                  "Fostering long-term partnerships built on reliability and professionalism."
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3 space-y-6">
               <h3 className="font-display text-5xl font-medium leading-tight">Beyond <br/> Distribution</h3>
               <p className="text-muted-foreground leading-relaxed">
                  We provide comprehensive support throughout the entire process, from regulatory compliance to efficient logistics, ensuring a seamless experience.
               </p>
            </div>
            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-12">
               <div className="p-10 rounded-3xl bg-slate-50 border border-border/50 hover-lift transition-all">
                  <Globe className="h-10 w-10 text-primary mb-6" />
                  <h4 className="text-xl font-bold mb-3 text-foreground">Global Reach</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Facilitating import/export with a vast network, ensuring timely delivery to healthcare providers worldwide.
                  </p>
               </div>
               <div className="p-10 rounded-3xl bg-slate-50 border border-border/50 hover-lift transition-all">
                  <Award className="h-10 w-10 text-primary mb-6" />
                  <h4 className="text-xl font-bold mb-3 text-foreground">Highest Standards</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    From generic drugs to specialized medications, we offer a diverse range that meets international quality protocols.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center space-y-6">
              <RotateCcw className="h-12 w-12 text-primary-glow" />
              <div>
                <h4 className="text-2xl font-display font-medium mb-2">100% Money back</h4>
                <p className="text-background/50 text-sm">Our guarantee on quality and authenticity.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-6">
              <ShieldCheck className="h-12 w-12 text-primary-glow" />
              <div>
                <h4 className="text-2xl font-display font-medium mb-2">Non-contact shipping</h4>
                <p className="text-background/50 text-sm">Prioritizing safety and hygiene in every shipment.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-6">
              <Truck className="h-12 w-12 text-primary-glow" />
              <div>
                <h4 className="text-2xl font-display font-medium mb-2">Complimentary Delivery</h4>
                <p className="text-background/50 text-sm">Free shipping on all orders over ₹200.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center bg-white">
        <div className="container mx-auto px-6 max-w-3xl space-y-10">
          <h2 className="font-display text-5xl font-medium">Join our global network</h2>
          <p className="text-xl text-muted-foreground leading-relaxed font-light">
            Thank you for considering Paskin as your pharmaceutical partner. Let's collaborate to enhance healthcare outcomes around the globe.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
            <button className="px-12 py-5 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary-glow transition shadow-xl hover:scale-105 active:scale-95">
              Contact Our Experts
            </button>
            <button className="px-12 py-5 rounded-full border-2 border-foreground text-foreground font-bold hover:bg-foreground hover:text-white transition hover:scale-105 active:scale-95">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
