import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, ShoppingBag, Zap, Loader } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { getPublicProducts } from "@/lib/api";
import { toast } from "sonner";

// Helper to parse benefits/bullets list text
const parseBenefit = (benefit: string) => {
  // Strip starting list numbers/dashes/bullets like "1. ", "02) ", "- ", "• "
  let cleaned = benefit.replace(/^[-•\*\d]+[\.\)]?\s*/, "").trim();

  const colonIndex = cleaned.indexOf(":");
  if (colonIndex !== -1) {
    return {
      title: cleaned.substring(0, colonIndex).trim(),
      content: cleaned.substring(colonIndex + 1).trim(),
    };
  }

  const dashIndex = cleaned.indexOf(" - ");
  if (dashIndex !== -1) {
    return {
      title: cleaned.substring(0, dashIndex).trim(),
      content: cleaned.substring(dashIndex + 3).trim(),
    };
  }

  return { title: "", content: cleaned };
};

// Map backend product to local Product structure
const mapBackendProduct = (p: any): any => {
  const benefitsArray = Array.isArray(p.benefits)
    ? p.benefits
    : typeof p.benefits === "string" && p.benefits.trim()
      ? p.benefits.split("\n").map((b: string) => b.trim()).filter(Boolean)
      : ["Pure & Natural", "Safe & Effective", "Quality Assured"];

  return {
    id: p._id,
    title: p.name || "",
    name: p.name || "",
    price: p.sellPrice || 0,
    oldPrice: p.basePrice || undefined,
    rating: p.rating || 4.8,
    reviews: p.reviews || 120,
    image:
      p.images?.[0] ||
      "https://images.unsplash.com/photo-1611073103901-09605d8f6cc9?auto=format&fit=crop&q=80&w=300",
    images: p.images || [],
    badge: p.isPaused ? "Paused" : undefined,
    category: typeof p.category === "object" && p.category ? p.category.name : p.category || "",
    description: p.description || "",
    bullets: benefitsArray,
    stock: p.stock !== undefined ? p.stock : 0,
    inStock: p.inStock !== undefined ? p.inStock : p.stock > 0,
  };
};

export function FeaturedProducts({ showButtons = true }: { showButtons?: boolean }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const data = await getPublicProducts({ featured: true });
        const mapped = data.map(mapBackendProduct);
        setProducts(mapped);
      } catch (error: any) {
        console.error("Failed to fetch featured products:", error);
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const handleAddToCart = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      // Map to ProductCard expected structure for addToCart
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        images: product.images,
        badge: product.badge,
        category: product.category,
        stock: product.stock,
        inStock: product.inStock,
      };
      addToCart(cartProduct);
      toast.success(`${product.name} added to cart!`);
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 text-center mb-16">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary/80">
          Herbal Wellness Products
        </span>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mt-4 text-foreground">
          Goodness of Nature, Backed by Science
        </h2>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-px w-12 bg-primary/20" />
          <Leaf className="h-5 w-5 text-primary/40" />
          <div className="h-px w-12 bg-primary/20" />
        </div>
      </div>

      <div className="container mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-500">Loading wellness products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center max-w-2xl mx-auto px-6 animate-in fade-in duration-500">
            <Leaf className="h-12 w-12 text-slate-300 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-800">No Featured Products Available</h3>
            <p className="text-slate-500 mt-2">
              Our herbal collection is temporarily offline. Check back shortly for our premium herbal formulations!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {products.map((product, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-border/50 p-6 flex flex-col justify-between shadow-sm hover-lift transition-all duration-500 animate-in fade-in duration-500 h-full group"
              >
                <div>
                  {/* Image Section */}
                  <Link
                    to={`/products/${product.id}`}
                    className="block aspect-square rounded-2xl overflow-hidden bg-muted/30 mb-6"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </Link>

                  {/* Title & Price Section */}
                  <div className="text-center space-y-2 mb-6">
                    <Link to={`/products/${product.id}`} className="block">
                      <h3 className="font-display text-xl md:text-2xl font-bold text-primary hover:text-primary-glow transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-xl font-bold text-foreground">₹{product.price}</p>
                  </div>
                </div>

                {/* Button Section */}
                <div className="space-y-4">
                  {showButtons && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock === 0}
                        className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold transition shadow-lg ${
                          product.stock === 0
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            : "bg-foreground text-background hover:bg-primary hover:text-white"
                        }`}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        {product.stock === 0 ? "Out of Stock" : "Add to Bag"}
                      </button>
                      {product.stock > 0 && (
                        <Link
                          to="/checkout"
                          onClick={() => handleAddToCart(product.id)}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-full text-xs font-bold hover:bg-primary-glow transition shadow-lg"
                        >
                          <Zap className="h-4 w-4" />
                          Buy Now
                        </Link>
                      )}
                    </div>
                  )}
                  <div className="text-center mt-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-glow transition group"
                    >
                      View Full Details
                      <Leaf className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
