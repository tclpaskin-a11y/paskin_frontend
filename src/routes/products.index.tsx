import { useMemo, useState, useEffect } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { Leaf, SlidersHorizontal, ChevronDown, X, Search, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPublicProducts, searchPublicProducts, getPublicCategories, getAllCategories } from "@/lib/api";
import { toast } from "sonner";

type SortOption = "Recommended" | "Newest" | "Price: Low to High" | "Price: High to Low" | "Rating";

const mapBackendProduct = (p: any): any => {
  return {
    id: p._id,
    name: p.name || "",
    price: p.sellPrice || 0,
    oldPrice: p.basePrice || undefined,
    rating: p.rating || 4.8,
    reviews: p.reviews || 120,
    image: p.images?.[0] || "https://images.unsplash.com/photo-1611073103901-09605d8f6cc9?auto=format&fit=crop&q=80&w=300",
    badge: p.isPaused ? "Paused" : undefined,
    category: typeof p.category === "object" && p.category ? p.category.name : (p.category || ""),
    categoryRawId: typeof p.category === "object" && p.category ? p.category._id : undefined,
    description: p.description || "",
    benefits: p.benefits || ["Safe & Effective", "Clinically Proven"],
    usage: p.usage || "Use as directed by physician.",
    ingredients: p.ingredients || "Active Pharma Ingredients."
  };
};

export default function ProductsPage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("Recommended");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [productsList, setProductsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch categories dynamically from products (as fallback)
  const extractCategoriesFromProducts = (currentProducts: any[]) => {
    if (currentProducts && currentProducts.length > 0) {
      const uniqueCatsMap = new Map<string, string>(); // name -> _id
      currentProducts.forEach(p => {
        if (p.category) {
          uniqueCatsMap.set(p.category, p.categoryRawId || p.category);
        }
      });
      const dynamicCats = Array.from(uniqueCatsMap.entries()).map(([name, _id]) => ({
        _id,
        name
      }));
      setCategoriesList([{ _id: "All", name: "All Products" }, ...dynamicCats]);
    } else {
      // Static fallback if no products are returned
      setCategoriesList([
        { _id: "All", name: "All Products" },
        { _id: "Antibiotics", name: "Antibiotics" },
        { _id: "Derma", name: "Derma" },
        { _id: "Dental", name: "Dental" },
        { _id: "Vitamins", name: "Vitamins & Supplements" },
      ]);
    }
  };

  // Fetch products and categories dynamically
  const fetchData = async (query = "", fetchCats = true) => {
    try {
      setLoading(true);
      
      // Concurrently fetch products and (optionally) categories
      const [productsRes, categoriesRes] = await Promise.allSettled([
        query.trim() ? searchPublicProducts(query) : getPublicProducts(),
        fetchCats ? getPublicCategories() : Promise.resolve(null)
      ]);

      let productsResult: any[] = [];
      if (productsRes.status === "fulfilled") {
        productsResult = productsRes.value.map(mapBackendProduct);
        setProductsList(productsResult);
      } else {
        toast.error("Failed to fetch products");
      }

      if (fetchCats) {
        if (
          categoriesRes.status === "fulfilled" && 
          categoriesRes.value && 
          Array.isArray(categoriesRes.value) && 
          categoriesRes.value.length > 0
        ) {
          const dynamicCats = categoriesRes.value.map((cat: any) => ({
            _id: cat._id,
            name: cat.name
          }));
          setCategoriesList([{ _id: "All", name: "All Products" }, ...dynamicCats]);
        } else {
          // If public categories endpoint fails or is empty, fallback to extracting from products
          extractCategoriesFromProducts(productsResult);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Load products and categories on mount
  useEffect(() => {
    fetchData("", true);
  }, []);

  // Debounced search on query change (auto search products, don't re-fetch categories)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(searchQuery, false);
    }, 450); // 450ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Calculate counts for each category
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { All: productsList.length };
    productsList.forEach(p => {
      if (p.category) {
        // Find match in categoriesList
        const matched = categoriesList.find(c => c.name?.toLowerCase() === p.category?.toLowerCase());
        const catName = matched ? matched.name : p.category;
        counts[catName] = (counts[catName] || 0) + 1;
      }
    });
    return counts;
  }, [productsList, categoriesList]);

  const filteredAndSorted = useMemo(() => {
    let result = selectedCat === "All"
      ? [...productsList]
      : productsList.filter(p => p.category.toLowerCase() === selectedCat.toLowerCase());

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
        result.reverse();
        break;
      default:
        break;
    }
    return result;
  }, [productsList, selectedCat, sortBy]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

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

      {/* Toolbar & Search Bar */}
      <section className="sticky top-[76px] z-30 bg-white/80 backdrop-blur-md border-b border-border/50 py-5 shadow-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
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

          {/* Elegant Search Input */}
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search products dynamically..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/60 rounded-full py-2.5 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
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
                  {categoriesList.map((cat) => {
                    const isAll = cat._id === "All";
                    const targetName = isAll ? "All" : cat.name;
                    const isActive = selectedCat.toLowerCase() === targetName.toLowerCase();
                    const count = catCounts[targetName] || 0;
                    
                    return (
                      <button
                        key={cat._id}
                        onClick={() => setSelectedCat(targetName)}
                        className={cn(
                          "flex items-center justify-between w-full text-left py-2 px-3 rounded-lg transition-all group",
                          isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            isActive ? "bg-white" : "bg-transparent border border-border group-hover:border-primary"
                          )} />
                          <span className="text-sm font-medium">
                            {isAll ? "All Products" : cat.name}
                          </span>
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-muted-foreground"
                        )}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
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
            {(selectedCat !== "All" || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-8 items-center">
                {selectedCat !== "All" && (
                  <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold animate-in fade-in">
                    Category: {selectedCat}
                    <button onClick={() => setSelectedCat("All")} className="hover:text-primary-glow transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {searchQuery && (
                  <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold animate-in fade-in">
                    Search: "{searchQuery}"
                    <button onClick={handleClearSearch} className="hover:text-primary-glow transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => { setSelectedCat("All"); handleClearSearch(); setSortBy("Recommended"); }}
                  className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors px-2 animate-in fade-in"
                >
                  CLEAR ALL
                </button>
              </div>
            )}

            {/* Loading / Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-32 bg-slate-50 rounded-3xl border border-slate-100">
                <Loader className="h-10 w-10 text-primary animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 animate-in fade-in duration-500">
                  {filteredAndSorted.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {filteredAndSorted.length === 0 && (
                  <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-border animate-in fade-in duration-500">
                    <div className="w-16 h-16 bg-white rounded-full shadow-soft flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                      <SlidersHorizontal className="h-8 w-8 opacity-20" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">No products found</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                    <button
                      onClick={() => { setSelectedCat("All"); handleClearSearch(); }}
                      className="mt-6 h-12 px-8 bg-primary text-white rounded-full font-bold hover:bg-primary-glow transition-all shadow-lg shadow-primary/20"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </>
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
                  {categoriesList.map((cat) => {
                    const isAll = cat._id === "All";
                    const targetName = isAll ? "All" : cat.name;
                    const isActive = selectedCat.toLowerCase() === targetName.toLowerCase();
                    const count = catCounts[targetName] || 0;

                    return (
                      <button
                        key={cat._id}
                        onClick={() => { setSelectedCat(targetName); setIsMobileFiltersOpen(false); }}
                        className={cn(
                          "flex items-center justify-between w-full py-3 px-4 rounded-xl transition-all",
                          isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-50"
                        )}
                      >
                        <span className="text-sm font-bold">{isAll ? "All Products" : cat.name}</span>
                        <span className="text-xs opacity-60">({count})</span>
                      </button>
                    );
                  })}
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
