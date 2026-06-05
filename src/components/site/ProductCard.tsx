import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  category?: string;
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <article className="group relative bg-white rounded-3xl overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-elegant">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <Link to={`/products/${product.id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        {product.badge && (
          <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            {product.badge}
          </span>
        )}
        <button
          aria-label="Wishlist"
          className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-white/90 backdrop-blur opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-primary hover:text-primary-foreground shadow-md z-10"
        >
          <Heart className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all z-10">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded-2xl text-xs font-bold hover:bg-primary transition-colors shadow-xl"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Bag
          </button>
          <Link 
            to="/checkout" 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-2xl text-xs font-bold hover:bg-primary-glow transition-colors shadow-xl"
          >
            <Zap className="h-3.5 w-3.5" />
            Buy Now
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          {product.category && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {product.category}
            </p>
          )}
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-[10px] font-bold">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/products/${product.id}`} className="block mb-3">
          <h3 className="font-display text-lg font-bold leading-tight hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-3">
          <span className="font-display text-xl font-bold text-primary">
            ₹{product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through opacity-50">
              ₹{product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
