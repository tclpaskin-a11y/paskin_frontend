import { Sparkles, Leaf, HeartPulse, Baby, FlaskConical, Flower2 } from "lucide-react";

const categories = [
  { icon: Sparkles, name: "Skincare", count: 24, hue: "from-accent/40 to-accent/10" },
  { icon: Leaf, name: "Herbal Medicine", count: 38, hue: "from-primary/30 to-primary/5" },
  { icon: HeartPulse, name: "Wellness", count: 19, hue: "from-accent/40 to-accent/10" },
  { icon: Baby, name: "Baby Care", count: 12, hue: "from-primary/30 to-primary/5" },
  { icon: FlaskConical, name: "Essential Oils", count: 16, hue: "from-accent/40 to-accent/10" },
  { icon: Flower2, name: "Hair Care", count: 21, hue: "from-primary/30 to-primary/5" },
];

export function Categories() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="flex items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-primary text-sm uppercase tracking-[0.2em] mb-3">Shop by category</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-balance max-w-xl">
            Nature's pharmacy, beautifully organized.
          </h2>
        </div>
        <a
          href="/products"
          className="hidden md:inline-block text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          View all →
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(({ icon: Icon, name, count, hue }, i) => (
          <a
            key={name}
            href="/products"
            className="group relative flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-card border border-border hover-lift overflow-hidden"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${hue} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
            <div className="relative grid place-items-center h-14 w-14 rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="relative font-display text-lg font-medium">{name}</h3>
            <p className="relative text-xs text-muted-foreground mt-1">{count} products</p>
          </a>
        ))}
      </div>
    </section>
  );
}
