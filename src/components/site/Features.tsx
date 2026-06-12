import { Leaf, FlaskConical, ShieldCheck, Sprout, Users } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Organic & Pure",
    description: "Carefully sourced organic herbs from pure Himalayan regions.",
  },
  {
    icon: FlaskConical,
    title: "Science Backed",
    description: "Researched formulations developed with modern scientific standards.",
  },
  {
    icon: ShieldCheck,
    title: "GMP Certified",
    description: "Manufactured in GMP compliant facilities ensuring quality.",
  },
  {
    icon: Sprout,
    title: "Sustainable",
    description: "Eco-friendly practices for a healthier planet and future.",
  },
  {
    icon: Users,
    title: "Trusted by Many",
    description: "Preferred by healthcare professionals and thousands of families.",
  },
];

export function Features() {
  return (
    <section className="relative z-20 py-8 container mx-auto px-6">
      <div className="bg-white rounded-3xl shadow-elegant p-4 md:p-6 border border-border/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform duration-500 group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
