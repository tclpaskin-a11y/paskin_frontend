import { useCart } from "@/hooks/use-cart";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardCart() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center"
        >
          <ShoppingBag className="h-10 w-10 text-muted-foreground stroke-1" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2">
            Looks like you haven't added anything to your cart yet.
          </p>
        </div>
        <Link to="/products">
          <Button size="lg" className="rounded-full px-8 gap-2">
            Browse Shop
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Shopping Cart</h1>
        <p className="text-muted-foreground mt-1">You have {totalItems} items in your cart.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-soft overflow-hidden group">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      {/* Image */}
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-border">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                        <p className="text-primary font-bold mt-2">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-center sm:items-end gap-4">
                        <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-1.5 border border-border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-white shadow-sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-bold w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-white shadow-sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/5 gap-2"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="border-none shadow-elegant sticky top-24">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes</span>
                  <span className="font-medium text-foreground">₹0</span>
                </div>
                <div className="h-px bg-slate-100 my-2" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/checkout" className="block">
                <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg hover:shadow-primary/20 transition-all">
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-center text-xs text-muted-foreground">
                Secure checkout with 256-bit SSL encryption.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
