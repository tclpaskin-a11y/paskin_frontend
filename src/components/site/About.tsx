import about from "@/assets/about-herbs.jpg";
import { Leaf, ShieldCheck, Award } from "lucide-react";

export function About() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant">
            <img
              src={about}
              alt="Fresh herbs"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-4 lg:-right-10 bg-card rounded-2xl shadow-elegant p-6 max-w-[220px] border border-border">
            <p className="font-display text-4xl font-semibold text-primary">12+</p>
            <p className="text-sm text-muted-foreground mt-1">
              Years of crafting trusted Ayurvedic remedies
            </p>
          </div>
        </div>

        <div>
          <p className="text-primary text-sm uppercase tracking-[0.2em] mb-4">Our Story</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium leading-tight text-balance">
            Bringing the wisdom of Ayurveda into your daily ritual.
          </h2>
          <p className="text-muted-foreground text-lg mt-6 leading-relaxed">
            At PASKIN, we honor centuries-old herbal traditions and translate them into modern,
            beautifully crafted wellness products. Every formulation is rooted in nature, free from
            harsh chemicals, and handcrafted in small batches by Ayurvedic experts.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            {[
              { icon: Leaf, title: "100% Organic" },
              { icon: ShieldCheck, title: "No Chemicals" },
              { icon: Award, title: "Lab Tested" },
            ].map(({ icon: Icon, title }) => (
              <div key={title} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/60">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{title}</span>
              </div>
            ))}
          </div>

          <a
            href="/about"
            className="inline-flex items-center mt-10 px-7 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-primary transition"
          >
            Learn more about PASKIN
          </a>
        </div>
      </div>
    </section>
  );
}
