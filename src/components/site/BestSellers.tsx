import { ProductCard } from "./ProductCard";
import { products } from "@/data/products";

export function BestSellers() {
  return (
    <section className="py-24 bg-secondary/40">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-primary text-sm uppercase tracking-[0.2em] mb-3">Most loved</p>
            <h2 className="font-display text-4xl md:text-5xl font-medium max-w-xl text-balance">
              Best sellers, crafted with care.
            </h2>
          </div>
          <a
            href="/products"
            className="hidden md:inline-block text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Shop all →
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
