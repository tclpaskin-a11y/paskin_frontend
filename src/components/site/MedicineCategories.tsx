import { Link } from "react-router-dom";
import { Pill, Syringe, Stethoscope, BriefcaseMedical, Leaf } from "lucide-react";
import catAntibiotics from "@/assets/cat-antibiotics.png";
import catDerma from "@/assets/cat-derma.png";
import catDental from "@/assets/cat-dental.png";
import catVitamins from "@/assets/cat-vitamins.png";

const categories = [
  {
    image: catVitamins,
    title: "Vitamins & Supplements",
    description: "Essential nutrients to support your everyday wellness.",
    icon: Syringe,
    color: "bg-orange-100",
    iconBg: "bg-orange-600",
  },
  {
    image: catAntibiotics,
    title: "Medicines",
    description: "Broad range of antibiotic medicines for various infections.",
    icon: Pill,
    color: "bg-blue-100",
    iconBg: "bg-blue-600",
  },
  {
    image: catDental,
    title: "Dental",
    description: "Complete oral care solutions for a healthy smile.",
    icon: BriefcaseMedical,
    color: "bg-cyan-100",
    iconBg: "bg-cyan-600",
  },
  {
    image: catDerma,
    title: "Derma",
    description: "Advanced dermatology solutions for healthy skin.",
    icon: Stethoscope,
    color: "bg-green-100",
    iconBg: "bg-green-600",
  },
];

export function MedicineCategories() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center mb-16">
        <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground">
          Our Pharma Products
        </h2>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="h-px w-10 bg-primary/20" />
          <Leaf className="h-5 w-5 text-primary/40" />
          <div className="h-px w-10 bg-primary/20" />
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link
              to="/products"
              key={i}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div
                className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 ${cat.color}`}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
                    <cat.icon className="h-8 w-8 text-purple-600 opacity-40" />
                  </div>
                )}

                {/* Floating Icon */}
                <div
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full ${cat.iconBg} flex items-center justify-center text-white border-4 border-white shadow-lg z-10 transition-transform duration-300 group-hover:scale-110`}
                >
                  <cat.icon className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 transition-colors text-blue-900">
                {cat.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
