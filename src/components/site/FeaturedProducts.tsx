import { Link } from "react-router-dom";
import { Leaf, ShoppingBag, Zap } from "lucide-react";
import capsulesImg from "@/assets/sea-buckthorn-capsules.png";
import pulpImg from "@/assets/sea-buckthorn-pulp.png";
import { useCart } from "@/hooks/use-cart";
import { products as allProducts } from "@/data/products";

const displayProducts = [
  {
    id: "sea-buckthorn-capsules",
    image: capsulesImg,
    title: "Sea Buckthorn Capsules",
    price: 32,
    bullets: [
      "Supports immunity",
      "Promotes healthy skin",
      "Rich in antioxidants",
      "Supports heart wellness",
    ],
  },
  {
    id: "sea-buckthorn-pulp",
    image: pulpImg,
    title: "Sea Buckthorn Pulp",
    price: 28,
    bullets: [
      "Natural source of Omega 3, 6, 7, 9",
      "Rich in vitamins & minerals",
      "Supports gut health",
      "Natural energy booster",
    ],
  },
];

export function FeaturedProducts({ showButtons = true }: { showButtons?: boolean }) {
  const { addToCart } = useCart();

  const handleAddToCart = (id: string) => {
    const product = allProducts.find((p) => p.id === id);
    if (product) addToCart(product);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayProducts.map((product, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-border/50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm hover-lift transition-all duration-500"
            >
              <Link
                to={`/products/${product.id}`}
                className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-muted/30"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </Link>
              <div className="w-full md:w-1/2 text-left">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-primary mb-2 hover:text-primary-glow transition-colors">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-2xl font-bold text-foreground mb-4">₹{product.price}</p>
                <ul className="space-y-3 mb-8">
                  {product.bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm md:text-base text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-full text-sm font-bold hover:bg-primary transition shadow-lg"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Bag
                  </button>
                  <Link
                    to="/checkout"
                    onClick={() => handleAddToCart(product.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-full text-sm font-bold hover:bg-primary-glow transition shadow-lg"
                  >
                    <Zap className="h-4 w-4" />
                    Buy Now
                  </Link>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/products/${product.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-glow transition group"
                  >
                    View Full Details
                    <Leaf className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
