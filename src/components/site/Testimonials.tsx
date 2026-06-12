import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Anaya Sharma",
    role: "Verified Buyer",
    text: "PASKIN's glow cream completely transformed my skin in 3 weeks. It feels like a daily ritual of self-care.",
    rating: 5,
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    name: "Rohan Mehta",
    role: "Yoga Instructor",
    text: "The Ashwagandha tonic has become essential to my wellness routine. Pure, potent, and beautifully crafted.",
    rating: 5,
    avatar: "https://i.pravatar.cc/120?img=12",
  },
  {
    name: "Priya Iyer",
    role: "New Mom",
    text: "Their baby care line is so gentle and trustworthy. Finally, products I feel safe using on my little one.",
    rating: 5,
    avatar: "https://i.pravatar.cc/120?img=32",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 gradient-cream">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-primary text-sm uppercase tracking-[0.2em] mb-3">Loved by thousands</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-balance">
            Real stories, real results.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="bg-card rounded-2xl p-8 shadow-soft border border-border hover-lift relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-accent/40" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-foreground leading-relaxed">"{r.text}"</blockquote>
              <figcaption className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                <img src={r.avatar} alt={r.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
