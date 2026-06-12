import { Play, Leaf, ShieldCheck, Award, Sprout } from "lucide-react";
import heroPrep from "@/assets/hero-prep.jpg";

const badges = [
  { icon: Leaf, label: "100% Organic" },
  { icon: ShieldCheck, label: "No Chemicals" },
  { icon: Award, label: "Lab Tested" },
  { icon: Sprout, label: "Cruelty Free" },
];

export function TrustVideo() {
  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-accent text-sm uppercase tracking-[0.2em] mb-3">From nature to you</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-balance">
            Watch how we craft each remedy by hand.
          </h2>
        </div>

        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-elegant group cursor-pointer max-w-5xl mx-auto">
          <img
            src={heroPrep}
            alt="Herbal preparation"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/30 transition" />
          <button className="absolute inset-0 grid place-items-center" aria-label="Play video">
            <span className="grid place-items-center h-20 w-20 rounded-full bg-primary text-primary-foreground shadow-elegant transition-transform group-hover:scale-110">
              <Play className="h-7 w-7 ml-1 fill-current" />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-background/15 hover:border-accent/50 transition"
            >
              <Icon className="h-7 w-7 text-accent mb-3" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
