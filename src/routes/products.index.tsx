import { useMemo, useState, useEffect } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/data/products";
import { Pill, Stethoscope, BriefcaseMedical, Syringe, Leaf, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const pharmaCategories = [
  { id: "All", title: "All Products", icon: Leaf },
  { id: "Antibiotics", title: "Antibiotics", icon: Pill },
  { id: "Derma", title: "Derma", icon: Stethoscope },
  { id: "Dental", title: "Dental", icon: BriefcaseMedical },
  { id: "Vitamins & Supplements", title: "Vitamins & Supplements", icon: Syringe },
];

type SortOption = "Recommended" | "Newest" | "Price: Low to High" | "Price: High to Low" | "Rating";

export default function ProductsPage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("Recommended");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    document.title = "Pharma Products — PASKIN";
  }, []);

  // Calculate counts for each category
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach(p => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = selectedCat === "All"
      ? [...products]
      : products.filter(p => p.category === selectedCat);

    switch (sortBy) {
      case "Price: Low to High":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "Newest":
        // Assuming newer products are at the end of the array, or we could add a date field
        result.reverse();
        break;
      default:
        break;
    }
    return result;
  }, [selectedCat, sortBy]);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Luxurious Header */}
      <section className="relative pt-24 pb-8 bg-[#f8f9f8] overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <nav className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary/60 mb-6">

            <span className="w-1 h-1 bg-primary/30 rounded-full" />
            <span className="text-primary">Pharma Collection</span>
          </nav>

          <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-2 leading-tight">
            Our <span className="italic font-light text-primary">Pharma</span> Products
          </h1>




        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[76px] z-30 bg-white/80 backdrop-blur-md border-b border-border/50 py-5 shadow-sm">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <div className="hidden lg:flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              FILTERS
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:border-primary transition-colors min-w-[180px] justify-between">
                <span>Sort by: <span className="font-bold">{sortBy}</span></span>
                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-full bg-white border border-border rounded-xl shadow-elegant opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1">
                {(["Recommended", "Newest", "Price: Low to High", "Price: High to Low", "Rating"] as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSortBy(opt)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors",
                      sortBy === opt ? "bg-primary/5 text-primary font-bold" : "hover:bg-slate-50"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 mt-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-8">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest text-foreground mb-6 pb-2 border-b border-border/50">Categories</h4>
                <div className="space-y-1.5">
                  {pharmaCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCat(cat.id)}
                      className={cn(
                        "flex items-center justify-between w-full text-left py-2 px-3 rounded-lg transition-all group",
                        selectedCat === cat.id ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          selectedCat === cat.id ? "bg-white" : "bg-transparent border border-border group-hover:border-primary"
                        )} />
                        <span className="text-sm font-medium">
                          {cat.title}
                        </span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        selectedCat === cat.id ? "bg-white/20 text-white" : "bg-slate-100 text-muted-foreground"
                      )}>
                        {catCounts[cat.id] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Price Range Placeholder */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest text-foreground mb-6 pb-2 border-b border-border/50">Price Range</h4>
                <div className="px-2">
                  <div className="h-1 bg-slate-100 rounded-full relative mb-6">
                    <div className="absolute inset-x-0 h-full bg-primary rounded-full" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm cursor-pointer" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 bg-slate-50 border border-border rounded-lg p-2 text-center text-xs font-bold">₹0</div>
                    <div className="text-muted-foreground">to</div>
                    <div className="flex-1 bg-slate-50 border border-border rounded-lg p-2 text-center text-xs font-bold">₹500+</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Listing */}
          <div className="flex-1">
            {/* Active Filters / Chips */}
            {selectedCat !== "All" && (
              <div className="flex flex-wrap gap-2 mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold">
                  Category: {selectedCat}
                  <button onClick={() => setSelectedCat("All")} className="hover:text-primary-glow transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => { setSelectedCat("All"); setSortBy("Recommended"); }}
                  className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors px-2"
                >
                  CLEAR ALL
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              {filteredAndSorted.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {filteredAndSorted.length === 0 && (
              <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-border">
                <div className="w-16 h-16 bg-white rounded-full shadow-soft flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                  <SlidersHorizontal className="h-8 w-8 opacity-20" />
                </div>
                <h3 className="text-lg font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                <button
                  onClick={() => setSelectedCat("All")}
                  className="mt-6 h-12 px-8 bg-primary text-white rounded-full font-bold hover:bg-primary-glow transition-all shadow-lg shadow-primary/20"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-[300px] bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 rounded-full hover:bg-white transition shadow-sm">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-8">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest text-foreground mb-4">Categories</h4>
                <div className="space-y-1">
                  {pharmaCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCat(cat.id); setIsMobileFiltersOpen(false); }}
                      className={cn(
                        "flex items-center justify-between w-full py-3 px-4 rounded-xl transition-all",
                        selectedCat === cat.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-50"
                      )}
                    >
                      <span className="text-sm font-bold">{cat.title}</span>
                      <span className="text-xs opacity-60">({catCounts[cat.id] || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border bg-slate-50">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







