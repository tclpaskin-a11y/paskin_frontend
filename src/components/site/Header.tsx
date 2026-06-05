import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, Minus, Plus, Trash2, Loader, Home, Leaf } from "lucide-react";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { searchPublicProducts } from "@/lib/api";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "Herbal Wellness" },
  { to: "/products", label: "Pharma" },
  { to: "/about-us", label: "About Us" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery("");
      setRecommendations([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setRecommendations([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const products = await searchPublicProducts(searchQuery);
        setRecommendations(products.slice(0, 5));
      } catch (err) {
        console.error("Search API failed:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      navigate("/");
    } catch (error) {
      // Logout anyway
      setUserMenuOpen(false);
      navigate("/");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDashboard = location.pathname.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <>
        {/* Compact Search Overlay */}
        {searchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-6">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 p-2 overflow-hidden">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-6 h-5 w-5 text-muted-foreground" />
                <input 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for medicines, herbal products..." 
                  className="w-full h-16 pl-16 pr-12 bg-transparent focus:outline-none text-lg font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 p-2 rounded-full hover:bg-slate-100 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>

              {searchLoading && (
                <div className="flex items-center justify-center py-6 border-t border-slate-100">
                  <Loader className="animate-spin text-primary h-5 w-5" />
                </div>
              )}

              {!searchLoading && recommendations.length > 0 && (
                <div className="border-t border-slate-100 max-h-72 overflow-y-auto bg-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4 mb-2 px-6">Recommendations</p>
                  <div className="divide-y divide-slate-50 px-2 pb-2">
                    {recommendations.map((prod) => (
                      <Link
                        key={prod._id}
                        to={`/products/${prod._id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                          <img 
                            src={prod.images?.[0] || "https://images.unsplash.com/photo-1611073103901-09605d8f6cc9?auto=format&fit=crop&q=80&w=300"} 
                            alt={prod.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-sm font-bold text-foreground line-clamp-1">{prod.name}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{prod.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-bold text-primary">₹{prod.sellPrice}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!searchLoading && searchQuery.trim() !== "" && recommendations.length === 0 && (
                <div className="p-6 border-t border-slate-100 text-center text-muted-foreground text-sm font-medium">
                  No products found for "{searchQuery}"
                </div>
              )}

              <div className="p-4 border-t border-slate-100">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2">Trending Searches</p>
                 <div className="flex flex-wrap gap-2">
                    {["Sea Buckthorn", "Amoxicillin", "Skin Care", "Dental", "Vitamins"].map(s => (
                      <button 
                        key={s} 
                        type="button"
                        onClick={() => {
                          setSearchQuery(s);
                        }}
                        className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-primary hover:text-primary transition-all text-xs font-medium"
                      >
                        {s}
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Drawer */}
        {cartOpen && (
          <div className="fixed inset-0 z-[100] animate-fade-in">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col">
              <div className="p-8 border-b border-border flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Bag ({totalItems})</h2>
                <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-slate-50 transition">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-8 space-y-6">
                 {items.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                     <ShoppingBag className="h-16 w-16 mb-4 stroke-1" />
                     <p className="text-lg font-medium">Your bag is empty</p>
                     <button onClick={() => setCartOpen(false)} className="mt-4 text-primary font-bold hover:underline">Start Shopping</button>
                   </div>
                 ) : (
                   items.map((item) => (
                     <div key={item.id} className="flex gap-4 group animate-in slide-in-from-right-4">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-border">
                          <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                             <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{item.name}</h4>
                             <button onClick={() => removeFromCart(item.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                               <Trash2 className="h-4 w-4" />
                             </button>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{item.category}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold">₹{item.price}</span>
                            <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-border/50">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-white transition shadow-sm"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-white transition shadow-sm"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                     </div>
                   ))
                 )}
              </div>

              <div className="p-8 bg-slate-50 space-y-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">Shipping & taxes calculated at checkout</p>
                <Link 
                  to={items.length === 0 ? "#" : "/checkout"} 
                  onClick={() => items.length > 0 && setCartOpen(false)} 
                  className={cn(
                    "w-full h-14 bg-primary hover:bg-primary-glow text-white rounded-2xl flex items-center justify-center font-bold text-lg transition-all shadow-lg",
                    items.length === 0 && "opacity-50 cursor-not-allowed grayscale"
                  )}
                >
                  Checkout Now
                </Link>
                <button onClick={() => setCartOpen(false)} className="w-full text-center text-sm font-medium hover:text-primary transition">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/60 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-50 px-4 py-2 flex items-center justify-between pb-safe-bottom">
          {/* Home */}
          <Link 
            to="/" 
            className={cn(
              "flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-300",
              location.pathname === "/" ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] tracking-wide font-medium">Home</span>
          </Link>

          {/* Search */}
          <button 
            onClick={() => setSearchOpen(true)}
            className={cn(
              "flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-300",
              searchOpen ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Search className="h-5 w-5" />
            <span className="text-[10px] tracking-wide font-medium">Search</span>
          </button>

          {/* Shop / Products */}
          <Link 
            to="/products" 
            className={cn(
              "flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-300",
              location.pathname.startsWith("/products") ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Leaf className="h-5 w-5" />
            <span className="text-[10px] tracking-wide font-medium">Shop</span>
          </Link>

          {/* Account */}
          <Link 
            to={isLoggedIn ? "/dashboard" : "/login"} 
            className={cn(
              "flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-300",
              location.pathname.startsWith("/dashboard") || location.pathname === "/login" || location.pathname === "/signup"
                ? "text-primary bg-primary/5 font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] tracking-wide font-medium">Account</span>
          </Link>

          {/* Cart */}
          <button 
            onClick={() => setCartOpen(true)}
            className={cn(
              "flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-300 relative",
              cartOpen ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[8px] grid place-items-center font-bold">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-wide font-medium">Cart</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b border-border/60 bg-white py-4",
        scrolled && "shadow-soft"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="PASKIN" className="h-11 w-auto transition-transform group-hover:scale-105" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                cn(
                  "text-sm font-medium text-foreground/75 hover:text-primary transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                  isActive && "text-primary after:w-full"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setSearchOpen(true)}
            aria-label="Search" 
            className="p-2.5 rounded-full hover:bg-muted transition"
          >
            <Search className="h-4 w-4" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="Account" 
              className="p-2.5 rounded-full hover:bg-muted transition hidden sm:inline-flex"
            >
              <User className="h-4 w-4" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-2xl shadow-elegant p-2 animate-fade-in z-50">
                {!isLoggedIn ? (
                  <>
                    <Link to="/login" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium">Log In</Link>
                    <Link to="/signup" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium">Sign Up</Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium">My Dashboard</Link>
                    <Link to="/dashboard/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium">My Orders</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium text-destructive">Logout</button>
                  </>
                )}
                <div className="h-px bg-slate-100 my-2" />
                <Link to="/contact" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium">Help Center</Link>
              </div>
            )}
          </div>

          <button 
            onClick={() => setCartOpen(true)}
            aria-label="Cart" 
            className="relative p-2.5 rounded-full hover:bg-muted transition"
          >
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] grid place-items-center font-semibold animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden p-2.5 rounded-full hover:bg-muted transition"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Compact Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-6">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 p-2 overflow-hidden">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-6 h-5 w-5 text-muted-foreground" />
              <input 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for medicines, herbal products..." 
                className="w-full h-16 pl-16 pr-12 bg-transparent focus:outline-none text-lg font-medium"
              />
              <button 
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 p-2 rounded-full hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </form>

            {searchLoading && (
              <div className="flex items-center justify-center py-6 border-t border-slate-100">
                <Loader className="animate-spin text-primary h-5 w-5" />
              </div>
            )}

            {!searchLoading && recommendations.length > 0 && (
              <div className="border-t border-slate-100 max-h-72 overflow-y-auto bg-white">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4 mb-2 px-6">Recommendations</p>
                <div className="divide-y divide-slate-50 px-2 pb-2">
                  {recommendations.map((prod) => (
                    <Link
                      key={prod._id}
                      to={`/products/${prod._id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                        <img 
                          src={prod.images?.[0] || "https://images.unsplash.com/photo-1611073103901-09605d8f6cc9?auto=format&fit=crop&q=80&w=300"} 
                          alt={prod.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-sm font-bold text-foreground line-clamp-1">{prod.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{prod.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-bold text-primary">₹{prod.sellPrice}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!searchLoading && searchQuery.trim() !== "" && recommendations.length === 0 && (
              <div className="p-6 border-t border-slate-100 text-center text-muted-foreground text-sm font-medium">
                No products found for "{searchQuery}"
              </div>
            )}

            <div className="p-4 border-t border-slate-100">
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2">Trending Searches</p>
               <div className="flex flex-wrap gap-2">
                  {["Sea Buckthorn", "Amoxicillin", "Skin Care", "Dental", "Vitamins"].map(s => (
                    <button 
                      key={s} 
                      type="button"
                      onClick={() => {
                        setSearchQuery(s);
                      }}
                      className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-primary hover:text-primary transition-all text-xs font-medium"
                    >
                      {s}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col">
            <div className="p-8 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Bag ({totalItems})</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-slate-50 transition">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-8 space-y-6">
               {items.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                   <ShoppingBag className="h-16 w-16 mb-4 stroke-1" />
                   <p className="text-lg font-medium">Your bag is empty</p>
                   <button onClick={() => setCartOpen(false)} className="mt-4 text-primary font-bold hover:underline">Start Shopping</button>
                 </div>
               ) : (
                 items.map((item) => (
                   <div key={item.id} className="flex gap-4 group animate-in slide-in-from-right-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-border">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{item.name}</h4>
                           <button onClick={() => removeFromCart(item.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                             <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">₹{item.price}</span>
                          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-border/50">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white transition shadow-sm"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white transition shadow-sm"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                   </div>
                 ))
               )}
            </div>

            <div className="p-8 bg-slate-50 space-y-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">Shipping & taxes calculated at checkout</p>
              <Link 
                to={items.length === 0 ? "#" : "/checkout"} 
                onClick={() => items.length > 0 && setCartOpen(false)} 
                className={cn(
                  "w-full h-14 bg-primary hover:bg-primary-glow text-white rounded-2xl flex items-center justify-center font-bold text-lg transition-all shadow-lg",
                  items.length === 0 && "opacity-50 cursor-not-allowed grayscale"
                )}
              >
                Checkout Now
              </Link>
              <button onClick={() => setCartOpen(false)} className="w-full text-center text-sm font-medium hover:text-primary transition">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setOpen(false)} />
          <nav className="absolute right-0 top-0 bottom-0 w-full max-w-[300px] bg-white p-8 shadow-2xl animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <img src={logo} alt="PASKIN" className="h-8 w-auto" />
              <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-slate-100 transition">
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) => 
                      cn(
                        "block px-4 py-3 rounded-xl hover:bg-slate-50 text-lg font-medium transition-colors",
                        isActive && "bg-primary/5 text-primary"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8 border-t border-slate-100 space-y-4">
               {!isLoggedIn ? (
                 <>
                   <Link to="/login" onClick={() => setOpen(false)} className="block w-full h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-bold">Log In</Link>
                   <Link to="/signup" onClick={() => setOpen(false)} className="block w-full h-14 bg-primary text-white rounded-2xl flex items-center justify-center font-bold">Sign Up</Link>
                 </>
               ) : (
                 <>
                   <Link to="/dashboard" onClick={() => setOpen(false)} className="block w-full h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-bold">My Dashboard</Link>
                   <button 
                    onClick={() => {
                      logout();
                      setOpen(false);
                      navigate("/");
                    }} 
                    className="block w-full h-14 border border-destructive text-destructive rounded-2xl flex items-center justify-center font-bold"
                   >
                     Logout
                   </button>
                 </>
               )}
            </div>
          </nav>
        </div>
      )}
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/60 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-50 px-4 py-2 flex items-center justify-between pb-safe-bottom">
        {/* Home */}
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-300",
            location.pathname === "/" ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] tracking-wide font-medium">Home</span>
        </Link>

        {/* Search */}
        <button 
          onClick={() => setSearchOpen(true)}
          className={cn(
            "flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-300",
            searchOpen ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] tracking-wide font-medium">Search</span>
        </button>

        {/* Shop / Products */}
        <Link 
          to="/products" 
          className={cn(
            "flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-300",
            location.pathname.startsWith("/products") ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Leaf className="h-5 w-5" />
          <span className="text-[10px] tracking-wide font-medium">Shop</span>
        </Link>

        {/* Account */}
        <Link 
          to={isLoggedIn ? "/dashboard" : "/login"} 
          className={cn(
            "flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-300",
            location.pathname.startsWith("/dashboard") || location.pathname === "/login" || location.pathname === "/signup"
              ? "text-primary bg-primary/5 font-semibold" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] tracking-wide font-medium">Account</span>
        </Link>

        {/* Cart */}
        <button 
          onClick={() => setCartOpen(true)}
          className={cn(
            "flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-300 relative",
            cartOpen ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[8px] grid place-items-center font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wide font-medium">Cart</span>
        </button>
      </div>
    </header>
  );
}
